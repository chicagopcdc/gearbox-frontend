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
  for (const singleItem of items) {
    const isRenderable = !!(
      singleItem?.field ||
      singleItem?.opText ||
      singleItem?.valueText ||
      singleItem?.text
    )
    if (isRenderable) n++
    if (Array.isArray(singleItem?.children) && singleItem.children.length) {
      n += countRenderable(singleItem.children)
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

/* find nested node that has { eligibility } */
function findEligibilityRoot(input: any): any | null {
  if (!input || typeof input !== 'object') return null
  const q = [input]
  let steps = 0
  while (q.length && steps < 500) {
    steps++
    const currentNode: any = q.shift()
    if (
      currentNode?.eligibility &&
      (currentNode.eligibility.inclusion || currentNode.eligibility.exclusion)
    )
      return currentNode
    for (const v of Object.values(currentNode || {}))
      if (v && typeof v === 'object') q.push(v)
  }
  return null
}

function massageTokensForTopLevel(tokens: any[]) {
  const out: any[] = []
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    const indent = Number(t?.indent ?? 0)

    // Drop the very first root "("
    if (i === 0 && t?.kind === 'group-open' && indent === 0) continue

    // For root ")", append its trailingJoiner to the previous LEAF, then drop it
    if (t?.kind === 'group-close' && indent === 0) {
      if (
        t?.trailingJoiner &&
        out.length > 0 &&
        out[out.length - 1]?.kind === 'leaf'
      ) {
        out[out.length - 1].trailingJoiner = t.trailingJoiner
      }
      continue
    }

    out.push(t)
  }
  return out
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
  coerced: boolean
  source: 'direct' | 'single' | 'map' | 'unknown'
} {
  if (!input || typeof input !== 'object') {
    return { eligibility: {}, coerced: false, source: 'unknown' }
  }
  // already shaped
  if (
    input.eligibility &&
    (input.eligibility.inclusion || input.eligibility.exclusion)
  ) {
    return {
      eligibility: input.eligibility,
      coerced: false,
      source: 'direct',
    }
  }
  // a single criteria tree
  if (isCriteriaNode(input)) {
    return {
      eligibility: { inclusion: input },
      coerced: true,
      source: 'single',
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
    return { eligibility: { inclusion }, coerced: true, source: 'map' }
  }
  // scan values for the first tree
  for (const v of Object.values(input)) {
    if (isCriteriaNode(v)) {
      return {
        eligibility: { inclusion: v },
        coerced: true,
        source: 'single',
      }
    }
  }
  return { eligibility: {}, coerced: false, source: 'unknown' }
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
  // form map and group names (used for section building and option labels)
  const fm: any = useEnsureFormMap('/gearbox/match-form')
  const formMap = (fm?.map ?? fm?.formMap ?? {}) as Record<
    string,
    | string
    | { label: string; shortLabel?: string; options?: Record<string, string> }
  >
  const groupNames = (fm?.groupNames ?? {}) as Record<string, string>
  const formLoading = !!fm?.loading
  const formError = (fm?.error ?? null) as string | null

  const fieldsById = useMemo(() => {
    const out: Record<string, any> = {}
    const fields =
      (Array.isArray(fm?.fields) && fm.fields) ||
      (Array.isArray(fm?.form?.fields) && fm.form.fields) ||
      (Array.isArray(fm?.schema?.fields) && fm.schema.fields) ||
      []
    for (const f of fields) out[String(f.id)] = f
    return out
  }, [fm])

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
      return raw.reduce((acc, singleItem) => {
        if (singleItem && singleItem.id !== undefined)
          acc[String(singleItem.id)] = singleItem.value
        return acc
      }, {} as Record<string, any>)
    }
    if (raw && Array.isArray(raw.data)) {
      return raw.data.reduce((acc: Record<string, any>, singleItem: any) => {
        if (singleItem && singleItem.id !== undefined)
          acc[String(singleItem.id)] = singleItem.value
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
  const { eligibility, coerced, source } = useMemo(() => {
    const chosen = matchInfoAlgorithm ?? fetched
    const nested = chosen ? findEligibilityRoot(chosen) : null
    if (nested && nested.eligibility) {
      return {
        eligibility: nested.eligibility,
        coerced: false,
        source: 'direct' as const,
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
    coerced: coerced,
    source: source,
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
        <div className="rounded-lg border bg-white p-4 ">
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

    const tokens = massageTokensForTopLevel(visible)

    return (
      <div className="rounded-lg border bg-white p-3">
        {DEBUG && (
          <pre className="text-xs bg-gray-50 border p-2 rounded mb-3">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        )}
        <div className="leading-6">
          {tokens.map((ln: any, i: number) => {
            const lineStyle: React.CSSProperties = { paddingLeft: ln.indent }

            let valueColor: string | undefined = undefined
            let bgValueColor: string | undefined = undefined

            // Colors of text
            if (ln.kind === 'leaf') {
              if (ln.matched === true) {
                valueColor = 'text-blue-700'
              } else {
                valueColor = 'text-red-700'
              }
            }

            // Colors of background
            if (ln.kind === 'leaf' && isHighlightActive) {
              if (ln.matched === true) {
                bgValueColor = 'bg-blue-100'
              } else {
                bgValueColor = 'bg-red-100'
              }
            }

            let displayValue: any = ln.valueText
            if (ln.kind === 'leaf' && typeof ln.valueText === 'string') {
              displayValue = `"${ln.valueText}"`
            }

            if (ln.kind === 'group-open') {
              return (
                <div key={i} style={{ paddingLeft: ln.indent }}>
                  (
                </div>
              )
            }

            if (ln.kind === 'group-close') {
              const hasJoiner = !!ln.trailingJoiner
              return (
                <div key={i} style={{ paddingLeft: ln.indent }}>
                  )
                  {hasJoiner ? (
                    <span className="italic text-gray-500">
                      {' '}
                      {ln.trailingJoiner}
                    </span>
                  ) : null}
                </div>
              )
            }

            if (ln.kind === 'leaf') {
              const hasField = !!ln.field
              const hasOp = !!ln.opText
              const hasValue =
                displayValue !== undefined &&
                displayValue !== null &&
                displayValue !== ''

              return (
                <div key={i} style={lineStyle} className={bgValueColor}>
                  {hasField ? (
                    <span className="whitespace-pre-wrap">{ln.field}</span>
                  ) : null}

                  {hasOp ? (
                    <span className="italic text-gray-500"> {ln.opText}</span>
                  ) : null}

                  {hasValue ? (
                    <>
                      {' '}
                      <span className={valueColor}>{displayValue}</span>
                      <span
                        className={`inline-block align-middle mx-1 ${valueColor}`}
                      >
                        {ln.matched === true ? '✓' : '✕'}
                      </span>
                    </>
                  ) : null}

                  {ln.trailingJoiner ? (
                    <span className="italic text-gray-500">
                      {' '}
                      {ln.trailingJoiner}
                    </span>
                  ) : null}
                </div>
              )
            }

            return null
          })}
        </div>
      </div>
    )
  }

  /* OUTLINE VIEW */
  if (!ready) {
    return (
      <div className="rounded-lg border bg-white p-4 ">
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
        const itemsWithMatch = (sec.items || []).map((singleItem: any) => ({
          ...singleItem,
          efficacyMatched: singleItem.matched,
        }))

        // visibility
        const visibleTop = itemsWithMatch.filter(
          (singleItem: any) =>
            !(isFilterActive && singleItem.efficacyMatched === false)
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
          .filter(
            (singleItem: any) =>
              singleItem.field ||
              singleItem.valueText ||
              singleItem.opText ||
              singleItem.text
          )
          .map((singleItem: any) =>
            singleItem.matched === true
              ? true
              : singleItem.matched === false
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
              <div className="px-4 pb-3  text-gray-500">
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
  const getKids = (singleItem: any): any[] =>
    Array.isArray(singleItem?.children)
      ? singleItem.children
      : Array.isArray(singleItem?.values)
      ? singleItem.values
      : Array.isArray(singleItem?.singleItemems)
      ? singleItem.items
      : []

  const efficacyMatch = (m?: boolean) =>
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
      return efficacyMatch(k.matched) !== false
    })
  }

  // render
  return (
    <ul className="p-4 list-disc pl-6">
      {items.map((singleItem, i) => {
        const kids = getKids(singleItem)
        const filteredKids = filterKids(kids)

        const hasStructured = !!(
          singleItem.field ||
          singleItem.opText ||
          singleItem.valueText
        )
        const isOneOf =
          typeof singleItem.opText === 'string' &&
          singleItem.opText.toLowerCase().includes('one of')

        // Hide a plain leaf when filtering and it's a negative match
        if (
          !kids.length &&
          isFilterActive &&
          efficacyMatch(singleItem.matched) === false
        )
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
                {singleItem.field ? (
                  <span className="whitespace-pre-wrap">
                    {singleItem.field}
                  </span>
                ) : null}
                {singleItem.opText ? (
                  <span className="italic text-gray-500">
                    {' '}
                    {singleItem.opText}
                    {singleItem.logic === 'any' ? '(ANY)' : null}
                  </span>
                ) : null}
              </div>

              {/* children as a vertical list */}
              <ul className="ml-4 mt-2 list-disc pl-5">
                {filteredKids.map((ch, idx) => {
                  const m = efficacyMatch(ch.matched)
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
          const m = efficacyMatch(singleItem.matched)
          return (
            <li key={i}>
              {singleItem.field ? (
                <span className="whitespace-pre-wrap">{singleItem.field}</span>
              ) : null}
              {singleItem.opText ? (
                <span className="italic text-gray-500">
                  {' '}
                  {singleItem.opText}
                </span>
              ) : null}
              {singleItem.valueText ? (
                <>
                  {' '}
                  <span className={valueClass(m)}>{singleItem.valueText}</span>
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
                {singleItem.field ? (
                  <span className="whitespace-pre-wrap">
                    {singleItem.field}
                  </span>
                ) : null}
                {singleItem.opText ? (
                  <span className="italic text-gray-500">
                    {' '}
                    {singleItem.opText}
                  </span>
                ) : null}
                {singleItem.valueText ? (
                  <>
                    {' '}
                    <span className={valueClass(singleItem.matched)}>
                      {singleItem.valueText}
                    </span>
                    {iconFor(efficacyMatch(singleItem.matched))}
                  </>
                ) : null}
                {singleItem.logic ? (
                  <span className="ml-2 text-xs text-gray-500">
                    ({singleItem.logic.toUpperCase()})
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
        if (singleItem.text && !hasStructured) {
          if (isFilterActive && efficacyMatch(singleItem.matched) === false)
            return null
          return (
            <li key={i}>
              <span className="whitespace-pre-wrap">{singleItem.text}</span>
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
