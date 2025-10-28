import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { buildEligibilitySections } from './trialMatch/sectionBuilder'
import { buildBooleanRich } from './trialMatch/booleanBuilder'
import { useEnsureFormMap } from './trialMatch/useEnsureFormMap'

/* simple flag for local debug */
const DEBUG = false

/* normalize for loose matching */
const canon = (s?: string | null) =>
  String(s ?? '')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()

// count leaf-like items (field/op/value OR text-only bullets) recursively
function countRenderable(items: any[]): number {
  if (!Array.isArray(items) || items.length === 0) return 0
  let n = 0
  for (const it of items) {
    const isRenderable = !!(
      it?.field ||
      it?.opText ||
      it?.valueText ||
      it?.text
    )
    if (isRenderable) n++
    if (Array.isArray(it?.children) && it.children.length) {
      n += countRenderable(it.children)
    }
  }
  return n
}

// turn boolean lines into outline-ish rows for fallback rendering
function booleanLinesToOutlineItems(lines: any[]) {
  const items: any[] = []
  for (const ln of lines) {
    if (ln.kind !== 'leaf') continue
    items.push({
      field: ln.field,
      opText: ln.opText,
      valueText: ln.valueText,
      matched: ln.matched,
    })
  }
  return items
}

/* check basic match_form shape */
function looksLikeFormSchema(obj: any): boolean {
  return !!obj && Array.isArray(obj?.groups) && Array.isArray(obj?.fields)
}

/* find nested node that has { eligibility } */
function findEligibilityRoot(input: any): any | null {
  if (!input || typeof input !== 'object') return null
  const q = [input]
  let steps = 0
  while (q.length && steps < 500) {
    steps++
    const cur: any = q.shift()
    if (
      cur?.eligibility &&
      (cur.eligibility.inclusion || cur.eligibility.exclusion)
    )
      return cur
    for (const v of Object.values(cur || {}))
      if (v && typeof v === 'object') q.push(v)
  }
  return null
}

type CriteriaNode = {
  operator?: string
  criteria?: any[]
  fieldName?: string
  fieldValue?: any
  fieldValueLabel?: string | null
  isMatched?: boolean | null
}

function isCriteriaNode(v: any): v is CriteriaNode {
  if (!v || typeof v !== 'object') return false
  if (Array.isArray(v.criteria)) return true
  return typeof v.operator === 'string' && ('fieldName' in v || 'criteria' in v)
}

function looksLikeNumberedCriteriaMap(obj: any): boolean {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false
  const entries = Object.entries(obj)
  if (entries.length === 0) return false
  let ok = 0
  for (const [k, v] of entries) if (/^\d+$/.test(k) && isCriteriaNode(v)) ok++
  return ok >= Math.max(1, Math.floor(entries.length * 0.5))
}

function coerceToEligibility(input: any): {
  eligibility: { inclusion?: any; exclusion?: any }
  _coerced: boolean
  _source: 'direct' | 'single' | 'map' | 'unknown'
} {
  if (!input || typeof input !== 'object') {
    return { eligibility: {}, _coerced: false, _source: 'unknown' }
  }
  // already shaped
  if (
    input.eligibility &&
    (input.eligibility.inclusion || input.eligibility.exclusion)
  ) {
    return {
      eligibility: input.eligibility,
      _coerced: false,
      _source: 'direct',
    }
  }
  // a single criteria tree
  if (isCriteriaNode(input)) {
    return {
      eligibility: { inclusion: input },
      _coerced: true,
      _source: 'single',
    }
  }
  // a numbered map of criteria trees
  if (looksLikeNumberedCriteriaMap(input)) {
    const nodes = Object.keys(input)
      .sort((a, b) => Number(a) - Number(b))
      .map((k) => input[k])
      .filter(isCriteriaNode)
    const inclusion =
      nodes.length === 1 ? nodes[0] : { operator: 'OR', criteria: nodes }
    return { eligibility: { inclusion }, _coerced: true, _source: 'map' }
  }
  // scan values for the first tree
  for (const v of Object.values(input)) {
    if (isCriteriaNode(v)) {
      return {
        eligibility: { inclusion: v },
        _coerced: true,
        _source: 'single',
      }
    }
  }
  return { eligibility: {}, _coerced: false, _source: 'unknown' }
}

/* GET helper that also follows plain-text URL bodies containing another URL */
async function fetchJSONMaybeRedirect(url: string) {
  const r1 = await fetch(url, { method: 'GET' })
  if (!r1.ok) throw new Error(`Failed to load ${url}: ${r1.status}`)
  const ct = (r1.headers.get('Content-Type') || '').toLowerCase()
  if (ct.includes('application/json')) {
    const parsed = await r1.json()
    if (typeof parsed === 'string') {
      const r2 = await fetch(parsed, { method: 'GET' })
      if (!r2.ok) throw new Error(`Follow URL failed: ${r2.status}`)
      return await r2.json()
    }
    return parsed
  }
  const txt = (await r1.text()).trim()
  try {
    const r2 = await fetch(new URL(txt).toString(), { method: 'GET' })
    if (!r2.ok) throw new Error(`Redirected fetch failed: ${r2.status}`)
    const ct2 = (r2.headers.get('Content-Type') || '').toLowerCase()
    if (ct2.includes('application/json')) return await r2.json()
    return JSON.parse(await r2.text())
  } catch {
    return JSON.parse(txt)
  }
}

/* props */
type MatchInfoDetailsProps = {
  isFilterActive?: boolean
  isHighlightActive?: boolean
  matchInfoAlgorithm?: any
  matchInfoId?: string
  matchDetailsUrl?: string
  viewMode?: 'outline' | 'boolean'
}

/* component */
function MatchInfoDetails({
  isFilterActive = false,
  isHighlightActive = false,
  matchInfoAlgorithm,
  matchInfoId,
  matchDetailsUrl,
  viewMode = 'outline',
}: MatchInfoDetailsProps) {
  // form map + group names (used for section building and option labels)
  const fm: any = useEnsureFormMap('/gearbox/match-form')
  const formMap = (fm?.map ?? fm?.formMap ?? {}) as Record<
    string,
    | string
    | {
        label: string
        shortLabel?: string
        options?: Record<string, string>
        section?: string
      }
  >
  const groupNames = (fm?.groupNames ?? {}) as Record<string, string>
  const formLoading = !!fm?.loading
  const formError = (fm?.error ?? null) as string | null

  // load full match_form for field id -> meta (label/options)
  const [fieldsById, setFieldsById] = useState<Record<string, any>>({})
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/gearbox/match-form', { method: 'GET' })
        if (!res.ok) return
        const ct = (res.headers.get('Content-Type') || '').toLowerCase()
        const body = ct.includes('application/json')
          ? await res.json()
          : await res.text()
        const data =
          typeof body === 'string'
            ? await (await fetch(body, { method: 'GET' })).json()
            : body
        if (!data || !looksLikeFormSchema(data)) return
        const byId: Record<string, any> = {}
        for (const f of data?.fields ?? []) byId[String(f.id)] = f
        if (!cancelled) setFieldsById(byId)
      } catch {
        /* no-op */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // read latest user selections from window event if props not provided
  const [liveUserMap, setLiveUserMap] = useState<Record<string, any>>({})
  useEffect(() => {
    const seed = (window as any).__gearboxUserInput
    if (seed?.map && Object.keys(seed.map).length > 0) setLiveUserMap(seed.map)
    const onUserInput = (e: Event) => {
      const m = (e as CustomEvent)?.detail?.map as
        | Record<string, any>
        | undefined
      if (m && Object.keys(m).length > 0) setLiveUserMap(m)
    }
    window.addEventListener('gearbox:user-input', onUserInput)
    return () => window.removeEventListener('gearbox:user-input', onUserInput)
  }, [])

  // normalize incoming user input into { [id]: value }
  const normalizeToMap = (raw: any): Record<string, any> => {
    if (!raw) return {}
    if (raw instanceof Map) {
      const out: Record<string, any> = {}
      for (const [k, v] of raw) out[String(k)] = v
      return out
    }
    if (Array.isArray(raw)) {
      return raw.reduce((acc, it) => {
        if (it && it.id !== undefined) acc[String(it.id)] = it.value
        return acc
      }, {} as Record<string, any>)
    }
    if (raw && Array.isArray(raw.data)) {
      return raw.data.reduce((acc: Record<string, any>, it: any) => {
        if (it && it.id !== undefined) acc[String(it.id)] = it.value
        return acc
      }, {})
    }
    return Object.entries(raw as Record<string, any>).reduce((acc, [k, v]) => {
      if (v == null) return acc
      if (typeof v === 'object' && !Array.isArray(v)) return acc
      acc[String(k)] = v
      return acc
    }, {} as Record<string, any>)
  }

  // build canon(field label) -> selected {kind,value}
  const selectedByField = useMemo(() => {
    if (!liveUserMap || !fieldsById) return {}
    const out: Record<
      string,
      { kind: 'label' | 'number'; value: string | number }
    > = {}
    for (const [idStr, raw] of Object.entries(liveUserMap)) {
      const f = fieldsById[String(idStr)]
      if (!f) continue
      const key = canon(f.label)
      if (f.type === 'number' || f.type === 'age') {
        const n = Number(raw)
        if (Number.isFinite(n)) out[key] = { kind: 'number', value: n }
      } else if (Array.isArray(f.options)) {
        // compare option.value loosely to handle 113 vs 113.0
        const hit =
          f.options.find(
            (o: any) => String(Number(o.value)) === String(Number(raw))
          ) ?? f.options.find((o: any) => String(o.value) === String(raw))
        const lab = hit?.label ?? String(raw)
        out[key] = { kind: 'label', value: lab }
      } else {
        out[key] = { kind: 'label', value: String(raw) }
      }
    }
    return out
  }, [liveUserMap, fieldsById])

  // fetch match details when not passed
  const [fetched, setFetched] = useState<any>(null)
  const [algLoading, setAlgLoading] = useState(false)
  const [algError, setAlgError] = useState<string | null>(null)
  useEffect(() => {
    if (matchInfoAlgorithm || !matchDetailsUrl) return
    let cancelled = false
    ;(async () => {
      try {
        setAlgLoading(true)
        setAlgError(null)
        const data = await fetchJSONMaybeRedirect(matchDetailsUrl)
        if (!cancelled) setFetched(data)
      } catch (e: any) {
        if (!cancelled)
          setAlgError(e?.message ?? 'Failed to load match details')
      } finally {
        if (!cancelled) setAlgLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [matchInfoAlgorithm, matchDetailsUrl])

  // resolve { eligibility } (prefer nested; else coerce)
  const { eligibility, _coerced, _source } = useMemo(() => {
    const chosen = matchInfoAlgorithm ?? fetched
    const nested = chosen ? findEligibilityRoot(chosen) : null
    if (nested && nested.eligibility) {
      return {
        eligibility: nested.eligibility,
        _coerced: false,
        _source: 'direct' as const,
      }
    }
    return coerceToEligibility(chosen)
  }, [matchInfoAlgorithm, fetched])

  const hasEligibility = !!(
    eligibility &&
    (eligibility.inclusion || eligibility.exclusion)
  )
  const ready = hasEligibility

  // section + boolean data from builders
  const outlineSections = useMemo(
    () =>
      ready
        ? buildEligibilitySections(
            { eligibility },
            { formMap, groupNames, userSelectedByField: selectedByField }
          )
        : [],
    [ready, eligibility, formMap, groupNames, selectedByField]
  )
  const booleanLines = useMemo(
    () =>
      ready
        ? buildBooleanRich(
            { eligibility },
            { userSelectedByField: selectedByField, formMap }
          )
        : [],
    [ready, eligibility, selectedByField, formMap]
  )

  // small debug object
  const debugInfo = {
    hasEligibility,
    coerced: _coerced,
    source: _source,
    formMapKeys: Object.keys(formMap).length,
    groupNamesCount: Object.keys(groupNames).length,
    outlineSectionCount: outlineSections.length,
    booleanLineCount: booleanLines.length,
    formLoading,
    formError,
    algLoading,
    algError,
    userInput: {
      rawKeyCount: Object.keys(liveUserMap).length,
      selectedCount: Object.keys(selectedByField).length,
      preview: Object.keys(selectedByField)
        .slice(0, 8)
        .map((k) => ({ field: k, sel: selectedByField[k] })),
    },
  }
  if (DEBUG) console.debug('[MatchInfoDetails] debug', debugInfo)

  /* BOOLEAN VIEW */
  if (viewMode === 'boolean') {
    if (!ready) {
      return (
        <div className="rounded-lg border bg-white p-4 text-sm">
          <div className="font-semibold">Preparing boolean view…</div>
          {DEBUG && (
            <pre className="text-xs bg-gray-50 border p-2 rounded mt-3">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          )}
        </div>
      )
    }
    const lines = booleanLines || []
    const visible = isFilterActive
      ? lines.filter((ln: any) =>
          ln.kind === 'leaf' ? (ln.matched ?? false) !== false : true
        )
      : lines

    return (
      <div className="rounded-lg border bg-white p-3">
        {DEBUG && (
          <pre className="text-xs bg-gray-50 border p-2 rounded mb-3">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        )}
        <div className="text-sm leading-6">
          {visible.map((ln: any, i: number) => {
            switch (ln.kind) {
              case 'group-open':
                return (
                  <div key={i} style={{ paddingLeft: ln.indent }}>
                    (
                  </div>
                )
              case 'group-close':
                return (
                  <div key={i} style={{ paddingLeft: ln.indent }}>
                    ){ln.trailingJoiner ? ` ${ln.trailingJoiner}` : ''}
                  </div>
                )
              case 'leaf': {
                const valueColor = isHighlightActive
                  ? ln.matched === true
                    ? 'text-blue-700'
                    : 'text-red-700'
                  : undefined
                return (
                  <div key={i} style={{ paddingLeft: ln.indent }}>
                    <span className="whitespace-pre-wrap">{ln.field} </span>
                    <span className="italic text-gray-500">{ln.opText}</span>
                    {ln.valueText ? (
                      <>
                        {' '}
                        <span className={valueColor}>{ln.valueText}</span>
                        <span
                          className={`inline-block align-middle mx-1 ${valueColor}`}
                        >
                          {ln.matched === true ? '✓' : '✕'}
                        </span>
                      </>
                    ) : null}
                    {ln.trailingJoiner ? (
                      <span className="ml-2 text-gray-500">
                        {ln.trailingJoiner}
                      </span>
                    ) : null}
                  </div>
                )
              }
              default:
                return null
            }
          })}
        </div>
      </div>
    )
  }

  /* OUTLINE VIEW */
  if (!ready) {
    return (
      <div className="rounded-lg border bg-white p-4 text-sm">
        <div className="font-semibold">Preparing eligibility outline…</div>
        {formLoading && (
          <div className="text-gray-500 mt-1">Loading match form…</div>
        )}
        {formError && (
          <div className="text-red-700 mt-1">
            Form error: {String(formError)}
          </div>
        )}
        {DEBUG && (
          <pre className="text-xs bg-gray-50 border p-2 rounded mt-3">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {DEBUG && (
        <pre className="text-xs bg-gray-50 border p-2 rounded">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      )}

      {outlineSections.map((sec: any, idx: number) => {
        // preserve computed matched (don’t invent false)
        const itemsWithMatch = (sec.items || []).map((it: any) => ({
          ...it,
          _effMatched: it.matched,
        }))

        // visibility
        const visibleTop = itemsWithMatch.filter(
          (it: any) => !(isFilterActive && it._effMatched === false)
        )

        // deep count
        const deepCount = countRenderable(visibleTop)

        // Fallback
        const needsFallback = deepCount === 0
        const fallbackItems = needsFallback
          ? booleanLinesToOutlineItems(booleanLines)
          : []

        // status: blue only if all leaves are true (and at least one)
        const leafMatches = (needsFallback ? fallbackItems : visibleTop)
          .filter((it: any) => it.field || it.valueText || it.opText || it.text)
          .map((it: any) =>
            it.matched === true
              ? true
              : it.matched === false
              ? false
              : undefined
          )
          .filter((x: any) => x !== undefined)

        const status: 'met' | 'not_met' =
          leafMatches.length > 0 &&
          leafMatches.every((m: boolean) => m === true)
            ? 'met'
            : 'not_met'

        if (DEBUG) {
          // quick peek so we can see why a section is empty
          // eslint-disable-next-line no-console
          console.debug('[Outline sec]', {
            idx,
            id: sec.id,
            title: sec.title,
            itemsTop: sec.items?.length ?? 0,
            deepCount,
            needsFallback,
          })
        }

        return (
          <details
            key={sec.id || idx}
            className="rounded-lg border bg-white"
            open
          >
            <summary className="cursor-pointer select-none list-none p-3 font-semibold">
              {sec.title}{' '}
              {status === 'met' ? (
                <span className="ml-2 text-blue-600">
                  (Screening Criteria Met)
                </span>
              ) : (
                <span className="ml-2 text-red-600">
                  (Screening Criteria Not Met)
                </span>
              )}
            </summary>

            {needsFallback ? (
              // Fallback
              <RenderItems
                items={fallbackItems}
                isHighlightActive={isHighlightActive}
                isFilterActive={isFilterActive}
              />
            ) : deepCount === 0 ? (
              <div className="px-4 pb-3 text-sm text-gray-500">
                No visible items for current filters.
              </div>
            ) : (
              <RenderItems
                items={visibleTop}
                isHighlightActive={isHighlightActive}
                isFilterActive={isFilterActive}
              />
            )}
          </details>
        )
      })}
    </div>
  )
}

/* outline list renderer */
function RenderItems({
  items,
  isHighlightActive,
  isFilterActive,
}: {
  items: Array<{
    text?: string
    field?: string
    opText?: string
    valueText?: string
    matched?: boolean
    children?: any[]
    values?: any[]
    items?: any[]
    logic?: 'all' | 'any'
  }>
  isHighlightActive: boolean
  isFilterActive: boolean
}) {
  if (!items?.length) return null

  // helpers
  const getKids = (it: any): any[] =>
    Array.isArray(it?.children)
      ? it.children
      : Array.isArray(it?.values)
      ? it.values
      : Array.isArray(it?.items)
      ? it.items
      : []

  const effMatch = (m?: boolean) =>
    m === true ? true : m === false ? false : false

  const valueClass = (m?: boolean) => {
    if (!isHighlightActive) return undefined
    return m ? 'text-blue-700' : 'text-red-700'
  }

  const iconFor = (m?: boolean) =>
    m ? (
      <span className="inline-block align-middle mx-1 text-blue-700">✓</span>
    ) : (
      <span className="inline-block align-middle mx-1 text-red-700">✕</span>
    )

  // Apply filtering to a list of children (hide explicit false when filter is active)
  const filterKids = (arr: any[]): any[] => {
    if (!isFilterActive) return arr
    return arr.filter((k) => {
      const kidsOfKid = getKids(k)
      if (kidsOfKid.length > 0) {
        return filterKids(kidsOfKid).length > 0
      }
      return effMatch(k.matched) !== false
    })
  }

  // render
  return (
    <ul className="p-4 list-disc pl-6">
      {items.map((it, i) => {
        const kids = getKids(it)
        const filteredKids = filterKids(kids)

        const hasStructured = !!(it.field || it.opText || it.valueText)
        const isOneOf =
          typeof it.opText === 'string' &&
          it.opText.toLowerCase().includes('one of')

        // Hide a plain leaf when filtering and it's a negative match
        if (!kids.length && isFilterActive && effMatch(it.matched) === false)
          return null

        // Group-only container (no field/op/value, just children)
        if (!hasStructured && kids.length > 0) {
          if (filteredKids.length === 0) return null
          return (
            <li key={`g-${i}`} className="list-none pl-0">
              <div className="mt-1 ml-4">
                <RenderItems
                  items={filteredKids as any}
                  isHighlightActive={isHighlightActive}
                  isFilterActive={isFilterActive}
                />
              </div>
            </li>
          )
        }

        // "Parent once + vertical list of options" style (ANY)
        if (hasStructured && isOneOf && kids.length > 0) {
          if (filteredKids.length === 0) return null
          return (
            <li key={i} className="mb-2">
              {/* header row: show parent line once */}
              <div>
                {it.field ? (
                  <span className="whitespace-pre-wrap">{it.field}</span>
                ) : null}
                {it.opText ? (
                  <span className="italic text-gray-500">
                    {' '}
                    {it.opText}
                    {it.logic === 'any' ? '(ANY)' : null}
                  </span>
                ) : null}
              </div>

              {/* children as a vertical list */}
              <ul className="ml-4 mt-2 list-disc pl-5">
                {filteredKids.map((ch, idx) => {
                  const m = effMatch(ch.matched)
                  const label = ch.valueText ?? ch.text ?? ch.field ?? ''
                  return (
                    <li key={`opt-${i}-${idx}`}>
                      <span className={valueClass(m)}>{label}</span>
                      {iconFor(m)}
                    </li>
                  )
                })}
              </ul>
            </li>
          )
        }

        // Simple leaf (structured row with optional value)
        if (hasStructured && !kids.length) {
          const m = effMatch(it.matched)
          return (
            <li key={i}>
              {it.field ? (
                <span className="whitespace-pre-wrap">{it.field}</span>
              ) : null}
              {it.opText ? (
                <span className="italic text-gray-500"> {it.opText}</span>
              ) : null}
              {it.valueText ? (
                <>
                  {' '}
                  <span className={valueClass(m)}>{it.valueText}</span>
                  {iconFor(m)}
                </>
              ) : null}
            </li>
          )
        }

        // Structured parent with (non-ANY) nested children
        if (hasStructured && kids.length > 0) {
          if (filteredKids.length === 0) return null
          return (
            <li key={i}>
              <div>
                {it.field ? (
                  <span className="whitespace-pre-wrap">{it.field}</span>
                ) : null}
                {it.opText ? (
                  <span className="italic text-gray-500"> {it.opText}</span>
                ) : null}
                {it.valueText ? (
                  <>
                    {' '}
                    <span className={valueClass(it.matched)}>
                      {it.valueText}
                    </span>
                    {iconFor(effMatch(it.matched))}
                  </>
                ) : null}
                {it.logic ? (
                  <span className="ml-2 text-xs text-gray-500">
                    ({it.logic.toUpperCase()})
                  </span>
                ) : null}
              </div>

              <div className="mt-1 ml-4">
                <RenderItems
                  items={filteredKids as any}
                  isHighlightActive={isHighlightActive}
                  isFilterActive={isFilterActive}
                />
              </div>
            </li>
          )
        }

        // Fallback: plain text
        if (it.text && !hasStructured) {
          if (isFilterActive && effMatch(it.matched) === false) return null
          return (
            <li key={i}>
              <span className="whitespace-pre-wrap">{it.text}</span>
            </li>
          )
        }

        return null
      })}
    </ul>
  )
}

MatchInfoDetails.defaultProps = {
  isFilterActive: false,
  isHighlightActive: false,
  viewMode: 'outline',
}

MatchInfoDetails.propTypes = {
  isFilterActive: PropTypes.bool,
  isHighlightActive: PropTypes.bool,
  matchInfoAlgorithm: PropTypes.object,
  matchInfoId: PropTypes.string,
  matchDetailsUrl: PropTypes.string,
  viewMode: PropTypes.oneOf(['outline', 'boolean']),
}

export default MatchInfoDetails
