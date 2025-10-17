/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { buildEligibilitySections } from './trialMatch/sectionBuilder'
import { buildBooleanRich } from './trialMatch/booleanBuilder'
import { useEnsureFormMap } from './trialMatch/useEnsureFormMap'

const DEBUG = false // false = debug off, true = debug on

// small normalizer for label keys
const canon = (s?: string | null) =>
  String(s ?? '')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()

// quick form schema check
function looksLikeFormSchema(obj: any): boolean {
  return !!obj && Array.isArray(obj?.groups) && Array.isArray(obj?.fields)
}

// find a node with eligibility
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

// loose coercion for various shapes
type CriteriaNode = {
  operator?: 'AND' | 'OR'
  criteria?: any[]
  fieldName?: string
  fieldValue?: any
  fieldValueLabel?: string | null
  isMatched?: boolean | null
}
function isCriteriaNode(v: any): v is CriteriaNode {
  if (!v || typeof v !== 'object') return false
  if (Array.isArray(v.criteria)) return true
  return !!v.fieldName && typeof v.operator === 'string'
}
function looksLikeNumberedCriteriaMap(obj: any): boolean {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false
  const entries = Object.entries(obj)
  if (entries.length === 0) return false
  let ok = 0
  for (const [k, v] of entries) if (/^\d+$/.test(k) && isCriteriaNode(v)) ok++
  return ok >= Math.max(1, Math.floor(entries.length * 0.5))
}
function coerceToEligibility(input: any) {
  if (!input || typeof input !== 'object')
    return { eligibility: {}, _coerced: false, _source: 'unknown' as const }
  if (
    input.eligibility &&
    (input.eligibility.inclusion || input.eligibility.exclusion)
  ) {
    return {
      eligibility: input.eligibility,
      _coerced: false,
      _source: 'direct' as const,
    }
  }
  if (isCriteriaNode(input))
    return {
      eligibility: { inclusion: input },
      _coerced: true,
      _source: 'single' as const,
    }
  if (looksLikeNumberedCriteriaMap(input)) {
    const nodes = Object.keys(input)
      .sort((a, b) => Number(a) - Number(b))
      .map((k) => input[k])
      .filter(isCriteriaNode)
    return {
      eligibility: {
        inclusion:
          nodes.length === 1 ? nodes[0] : { operator: 'OR', criteria: nodes },
      },
      _coerced: true,
      _source: 'map' as const,
    }
  }
  for (const v of Object.values(input))
    if (isCriteriaNode(v))
      return {
        eligibility: { inclusion: v },
        _coerced: true,
        _source: 'found' as const,
      }
  return { eligibility: {}, _coerced: false, _source: 'unknown' as const }
}

// GET that also follows plain-text URL bodies
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

type MatchInfoDetailsProps = {
  isFilterActive?: boolean
  isHighlightActive?: boolean
  matchInfoAlgorithm?: any
  matchInfoId?: string
  matchDetailsUrl?: string
  viewMode?: 'outline' | 'boolean'
  // accepts map, array of {id,value}, wrapped array { data: [...] }
  userInputValues?: any
}

function MatchInfoDetails({
  isFilterActive = false,
  isHighlightActive = false,
  matchInfoAlgorithm,
  matchInfoId,
  matchDetailsUrl,
  viewMode = 'outline',
  userInputValues,
}: MatchInfoDetailsProps) {
  // form map + group names
  const fm: any = useEnsureFormMap('/gearbox/match-form')
  const formMap = (fm?.map ?? fm?.formMap ?? {}) as Record<string, any>
  const groupNames = (fm?.groupNames ?? {}) as Record<string, string>
  const formLoading = !!fm?.loading
  const formError = (fm?.error ?? null) as string | null

  // id -> field meta
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
        /* ignore */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // listen for broadcasted user input (from postUserInput)
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

  // normalize any shape into { [id]: value }
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
    if (typeof raw === 'object') {
      for (const v of Object.values(raw)) {
        if (
          Array.isArray(v) &&
          v.length &&
          typeof v[0] === 'object' &&
          'id' in (v[0] as any)
        ) {
          return (v as Array<{ id: number | string; value: any }>).reduce(
            (acc, { id, value }) => {
              acc[String(id)] = value
              return acc
            },
            {} as Record<string, any>
          )
        }
      }
    }
    return Object.entries(raw as Record<string, any>).reduce((acc, [k, v]) => {
      if (v == null) return acc
      if (typeof v === 'object' && !Array.isArray(v)) return acc
      acc[String(k)] = v
      return acc
    }, {} as Record<string, any>)
  }

  // prefer prop map; else event map
  const propMap = useMemo(
    () => normalizeToMap(userInputValues),
    [userInputValues]
  )
  const finalUserMap = Object.keys(propMap).length > 0 ? propMap : liveUserMap

  // build canon(field label) -> { kind, value }
  const selectedByField = useMemo(() => {
    if (!finalUserMap || !fieldsById) return {}
    const out: Record<
      string,
      { kind: 'label' | 'number'; value: string | number }
    > = {}
    for (const [idStr, raw] of Object.entries(finalUserMap)) {
      const f = fieldsById[String(idStr)]
      if (!f) continue
      const key = canon(f.label)
      if (f.type === 'number' || f.type === 'age') {
        const n = Number(raw)
        if (Number.isFinite(n)) out[key] = { kind: 'number', value: n }
      } else if (Array.isArray(f.options)) {
        const lab =
          f.options.find((o: any) => String(o.value) === String(raw))?.label ??
          String(raw)
        out[key] = { kind: 'label', value: lab }
      } else {
        out[key] = { kind: 'label', value: String(raw) }
      }
    }
    return out
  }, [finalUserMap, fieldsById])

  // fetch match details if not provided
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

  // coerce to { eligibility }
  const { eligibility, _coerced, _source } = useMemo(() => {
    const chosen = matchInfoAlgorithm ?? fetched
    const nested = chosen ? findEligibilityRoot(chosen) : null
    if (nested)
      return {
        eligibility: nested.eligibility,
        _coerced: false,
        _source: 'direct' as const,
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
        ? buildEligibilitySections({ eligibility }, { formMap, groupNames })
        : [],
    [ready, eligibility, formMap, groupNames]
  )
  const booleanLines = useMemo(
    () => (ready ? buildBooleanRich({ eligibility }) : []),
    [ready, eligibility]
  )

  // matching helpers
  const parseMaybeNumber = (s: string | number | null | undefined) => {
    if (s == null) return null
    const raw = typeof s === 'number' ? String(s) : s
    const trimmed = raw.trim()
    if (trimmed === '') return null
    const n = Number(trimmed.replace(/[^0-9.-]/g, ''))
    return Number.isFinite(n) ? n : null
  }

  // uses user selection to decide match
  const deriveMatch = (
    fieldLabel?: string,
    opText?: string,
    valueText?: string
  ): boolean | undefined => {
    if (!fieldLabel) return undefined
    const sel = selectedByField[canon(fieldLabel)]
    if (!sel) return undefined

    const op = (opText || '').toLowerCase()

    if (sel.kind === 'label') {
      if (op.includes('equal')) {
        return canon(String(sel.value)) === canon(String(valueText))
      }
      return undefined
    }

    if (sel.kind === 'number') {
      const target = parseMaybeNumber(valueText)
      if (target == null) return undefined
      const val = Number(sel.value)
      if (op.includes('greater') && op.includes('equal')) return val >= target
      if (op.includes('greater')) return val > target
      if (op.includes('less') && op.includes('equal')) return val <= target
      if (op.includes('less')) return val < target
      if (op.includes('equal')) return val === target
      return undefined
    }

    return undefined
  }

  // debug
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
      source:
        Object.keys(normalizeToMap(userInputValues)).length > 0
          ? 'prop'
          : Object.keys(liveUserMap).length > 0
          ? 'event'
          : 'none',
      rawKeyCount: Object.keys(
        Object.keys(normalizeToMap(userInputValues)).length > 0
          ? normalizeToMap(userInputValues)
          : liveUserMap
      ).length,
      selectedCount: Object.keys(selectedByField).length,
      preview: Object.keys(selectedByField)
        .slice(0, 10)
        .map((k) => ({ field: k, sel: selectedByField[k] })),
    },
  }
  if (DEBUG) console.debug('[MatchInfoDetails] debug', debugInfo)

  // BOOLEAN VIEW
  if (viewMode === 'boolean') {
    if (!ready) {
      return (
        <div className="rounded-lg border bg-white p-4 text-sm">
          <div className="font-semibold">Preparing boolean view…</div>
          <pre className="text-xs bg-gray-50 border p-2 rounded mt-3">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )
    }
    const lines = booleanLines || []
    const visible = isFilterActive
      ? lines.filter((ln) => {
          if (ln.kind !== 'leaf') return true
          const eff =
            (ln as any).matched ??
            deriveMatch(ln.field, ln.opText, ln.valueText) ??
            false
          return eff !== false
        })
      : lines

    return (
      <div className="rounded-lg border bg-white p-4">
        {DEBUG && (
          <pre className="text-xs bg-gray-50 border p-2 rounded mb-3">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        )}
        <div className="text-sm leading-6 font-mono">
          {visible.map((ln: any, i: number) => {
            const effMatched =
              ln.kind === 'leaf'
                ? (ln as any).matched ??
                  deriveMatch(ln.field, ln.opText, ln.valueText) ??
                  false
                : undefined
            switch (ln.kind) {
              case 'group-open':
                return (
                  <div
                    key={i}
                    style={{ paddingLeft: ln.indent }}
                    className="whitespace-pre"
                  >
                    (
                  </div>
                )
              case 'group-close':
                return (
                  <div
                    key={i}
                    style={{ paddingLeft: ln.indent }}
                    className="whitespace-pre"
                  >
                    )
                    {ln.trailingJoiner ? (
                      <span className="ml-2 text-gray-500">
                        {ln.trailingJoiner}
                      </span>
                    ) : null}
                  </div>
                )
              case 'leaf': {
                const valueColor = effMatched ? 'text-blue-700' : 'text-red-700'
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
                          {effMatched ? '✓' : '✕'}
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
            }
          })}
        </div>
      </div>
    )
  }

  // OUTLINE VIEW
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
        <pre className="text-xs bg-gray-50 border p-2 rounded mt-3">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {DEBUG && (
        <pre className="text-xs bg-gray-50 border p-2 rounded">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      )}

      {outlineSections.map((sec: any) => {
        // compute per-item effective match (default red)
        const itemsWithMatch = sec.items.map((it: any) => {
          const m =
            it.matched ??
            deriveMatch(it.field, it.opText, it.valueText) ??
            false // default red
          return { ...it, _effMatched: m }
        })

        const visible = itemsWithMatch.filter(
          (it: any) => !(isFilterActive && it._effMatched === false)
        )

        // leaf-only evaluation for status (default not_met if not all true)
        const leafMatches = itemsWithMatch
          .filter((it: any) => it.field || it.valueText || it.opText)
          .map((it: any) => it._effMatched as boolean)

        const status: 'met' | 'not_met' =
          leafMatches.length > 0 &&
          leafMatches.every((m: boolean) => m === true)
            ? 'met'
            : 'not_met'

        return (
          <details key={sec.id} className="rounded-lg border bg-white" open>
            <summary className="cursor-pointer select-none list-none p-3 font-semibold">
              {sec.title}{' '}
              {status === 'met' && (
                <span className="ml-2 text-blue-600">
                  (Screening Criteria Met)
                </span>
              )}
              {status === 'not_met' && (
                <span className="ml-2 text-red-600">
                  (Screening Criteria Not Met)
                </span>
              )}
            </summary>

            {visible.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 italic">
                No criteria listed.
              </div>
            ) : (
              <RenderItems
                items={visible}
                isHighlightActive={isHighlightActive}
                isFilterActive={isFilterActive}
                deriveMatch={deriveMatch}
              />
            )}
          </details>
        )
      })}
    </div>
  )
}

// outline item list; red color if builder didn’t set matched
function RenderItems({
  items,
  isHighlightActive,
  isFilterActive,
  deriveMatch,
}: {
  items: Array<{
    text?: string
    field?: string
    opText?: string
    valueText?: string
    matched?: boolean
    children?: any[]
    logic?: 'all' | 'any'
  }>
  isHighlightActive: boolean
  isFilterActive: boolean
  deriveMatch: (
    field?: string,
    opText?: string,
    valueText?: string
  ) => boolean | undefined
}) {
  if (!items?.length) return null

  const valueClass = (m?: boolean) => {
    if (!isHighlightActive) return undefined
    return m ? 'text-blue-700' : 'text-red-700' // default red
  }

  const iconFor = (m?: boolean) =>
    m ? (
      <span className="inline-block align-middle mx-1 text-blue-700">✓</span>
    ) : (
      <span className="inline-block align-middle mx-1 text-red-700">✕</span>
    ) // default red icon

  return (
    <ul className="p-4 list-disc pl-6">
      {items.map((it, i) => {
        // grouping-only node
        if (!it.text && !it.field && it.children && it.children.length > 0) {
          return (
            <li key={`g-${i}`} className="list-none pl-0">
              <div className="mt-1">
                <RenderItems
                  items={it.children as any}
                  isHighlightActive={isHighlightActive}
                  isFilterActive={isFilterActive}
                  deriveMatch={deriveMatch}
                />
              </div>
            </li>
          )
        }

        const hasStructured = !!(it.field || it.opText || it.valueText)
        const effMatched =
          it.matched ?? deriveMatch(it.field, it.opText, it.valueText) ?? false // default red

        return (
          <li key={i}>
            {hasStructured ? (
              <>
                {it.field ? (
                  <span className="whitespace-pre-wrap">{it.field}</span>
                ) : null}
                {it.opText ? (
                  <span className="italic text-gray-500"> {it.opText}</span>
                ) : null}
                {it.valueText ? (
                  <>
                    {' '}
                    <span className={valueClass(effMatched)}>
                      {it.valueText}
                    </span>
                    {iconFor(effMatched)}
                  </>
                ) : null}
              </>
            ) : null}

            {!hasStructured && it.text ? (
              <span className="whitespace-pre-wrap">{it.text}</span>
            ) : null}

            {it.children && it.children.length > 0 && it.logic && (
              <span className="ml-2 text-xs text-gray-500">
                ({(it.logic as string).toUpperCase()})
              </span>
            )}
            {it.children && it.children.length > 0 && (
              <div className="mt-1">
                <RenderItems
                  items={it.children as any}
                  isHighlightActive={isHighlightActive}
                  isFilterActive={isFilterActive}
                  deriveMatch={deriveMatch}
                />
              </div>
            )}
          </li>
        )
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
  userInputValues: PropTypes.any,
}

export default MatchInfoDetails
