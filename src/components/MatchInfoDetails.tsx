/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { buildEligibilitySections } from './trialMatch/sectionBuilder'
import { buildBooleanRich } from './trialMatch/booleanBuilder'
import { useEnsureFormMap } from './trialMatch/useEnsureFormMap'

/**
 * DEBUG flag:
 * - true: logs a compact state object to the console and shows it in the UI.
 * - false: no logs, no UI block.
 */
const DEBUG = false

const MERGE_AS: 'OR' | 'AND' = 'OR'

// helpers
/**
 * Normalizes quotes/dashes/spacing and lowercases.
 * Used to build robust keys when mapping labels to groups.
 */
const CANON = (s?: string | null) =>
  String(s ?? '')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()

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
  let score = 0
  for (const [k, v] of entries) {
    const isNumKey = /^[0-9]+$/.test(k)
    if (isNumKey && isCriteriaNode(v)) score++
  }
  return score >= Math.max(1, Math.floor(entries.length * 0.5))
}

function coerceToEligibility(input: any): {
  eligibility: { inclusion?: any; exclusion?: any }
  _coerced: boolean
  _source: 'direct' | 'single' | 'map' | 'unknown'
} {
  if (!input || typeof input !== 'object') {
    return { eligibility: {}, _coerced: false, _source: 'unknown' }
  }
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
  if (isCriteriaNode(input)) {
    return {
      eligibility: { inclusion: input },
      _coerced: true,
      _source: 'single',
    }
  }
  if (looksLikeNumberedCriteriaMap(input)) {
    const nodes = Object.keys(input)
      .sort()
      .map((k) => input[k])
      .filter(isCriteriaNode)
    const inclusion =
      nodes.length === 1 ? nodes[0] : { operator: MERGE_AS, criteria: nodes }
    return { eligibility: { inclusion }, _coerced: true, _source: 'map' }
  }
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

/**
 * Fetches JSON from a URL or from a URL returned as the response body.
 * Accepts JSON or a plain URL string that points to JSON.
 */
async function fetchJSONMaybeRedirect(url: string) {
  const res1 = await fetch(url, { method: 'GET' })
  if (!res1.ok) throw new Error(`Failed to load ${url}: ${res1.status}`)
  const ct = (res1.headers.get('Content-Type') || '').toLowerCase()
  if (ct.includes('application/json')) {
    const parsed = await res1.json()
    if (typeof parsed === 'string') {
      const res2 = await fetch(parsed, { method: 'GET' })
      if (!res2.ok) throw new Error(`Follow URL failed: ${res2.status}`)
      return await res2.json()
    }
    return parsed
  }
  const txt = (await res1.text()).trim()
  try {
    const u = new URL(txt)
    const res2 = await fetch(u.toString(), { method: 'GET' })
    if (!res2.ok) throw new Error(`Redirected fetch failed: ${res2.status}`)
    const ct2 = (res2.headers.get('Content-Type') || '').toLowerCase()
    if (ct2.includes('application/json')) return await res2.json()
    return JSON.parse(await res2.text())
  } catch {
    return JSON.parse(txt)
  }
}

// outline item renderer
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
    logic?: 'all' | 'any'
  }>
  isHighlightActive: boolean
  isFilterActive: boolean
}) {
  if (!items?.length) return null

  const valueClass = (matched?: boolean) => {
    if (!isHighlightActive) return undefined
    if (matched === true) return 'text-blue-700'
    if (matched === false) return 'text-red-700'
    return !isFilterActive ? 'text-amber-700' : undefined
  }

  const iconFor = (matched?: boolean) =>
    matched === true ? (
      <span className="inline-block align-middle mx-1 text-blue-700">✓</span>
    ) : matched === false ? (
      <span className="inline-block align-middle mx-1 text-red-700">✕</span>
    ) : null

  return (
    <ul className="p-4 list-disc pl-6">
      {items.map((it, i) => {
        if (!it.text && !it.field && it.children && it.children.length > 0) {
          return (
            <li key={`g-${i}`} className="list-none pl-0">
              <div className="mt-1">
                <RenderItems
                  items={it.children}
                  isHighlightActive={isHighlightActive}
                  isFilterActive={isFilterActive}
                />
              </div>
            </li>
          )
        }

        const hasStructured = !!(it.field || it.opText || it.valueText)

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
                    <span className={valueClass(it.matched)}>
                      {it.valueText}
                    </span>
                    {iconFor(it.matched)}
                  </>
                ) : null}
              </>
            ) : null}

            {!hasStructured && it.text ? (
              <span className="whitespace-pre-wrap">{it.text}</span>
            ) : null}

            {it.children && it.children.length > 0 && it.logic && (
              <span className="ml-2 text-xs text-gray-500">
                ({it.logic.toUpperCase()})
              </span>
            )}
            {it.children && it.children.length > 0 && (
              <div className="mt-1">
                <RenderItems
                  items={it.children}
                  isHighlightActive={isHighlightActive}
                  isFilterActive={isFilterActive}
                />
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

// component
type MatchInfoDetailsProps = {
  isFilterActive?: boolean
  isHighlightActive?: boolean
  matchInfoAlgorithm: any
  matchInfoId?: string
  matchDetailsUrl?: string
  viewMode?: 'outline' | 'boolean'
}

const MatchInfoDetails: React.FC<MatchInfoDetailsProps> = ({
  isFilterActive = false,
  isHighlightActive = false,
  matchInfoAlgorithm,
  matchInfoId,
  matchDetailsUrl,
  viewMode = 'outline',
}) => {
  // Form schema (map + groups)
  const fm: any = useEnsureFormMap('/gearbox/match-form')
  const formMap = (fm?.map ?? fm?.formMap ?? {}) as Record<string, string>
  const groupNames = (fm?.groupNames ?? {}) as Record<string, string>
  const formLoading = !!fm?.loading
  const formError = (fm?.error ?? null) as string | null

  // Try to resolve eligibility from props; if not found, optionally fetch
  const [rawAlg, setRawAlg] = useState<any>(null)
  const [algLoading, setAlgLoading] = useState(false)
  const [algError, setAlgError] = useState<string | null>(null)
  const [algSource, setAlgSource] = useState<'props' | 'fetched' | 'none'>(
    'none'
  )

  // props first
  useEffect(() => {
    if (!matchInfoAlgorithm) return
    setRawAlg(matchInfoAlgorithm)
    setAlgSource('props')
  }, [matchInfoAlgorithm])

  // fetch if still nothing and a URL is provided
  useEffect(() => {
    if (rawAlg || !matchDetailsUrl) return
    let cancelled = false
    ;(async () => {
      try {
        setAlgLoading(true)
        setAlgError(null)
        const data = await fetchJSONMaybeRedirect(matchDetailsUrl)
        if (cancelled) return
        setRawAlg(data)
        setAlgSource('fetched')
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
  }, [rawAlg, matchDetailsUrl])

  // Coerce whatever we have into { eligibility: ... }
  const { eligibility, _coerced, _source } = useMemo(
    () => coerceToEligibility(rawAlg),
    [rawAlg]
  )

  const effectiveAlg = useMemo(() => {
    return eligibility && (eligibility.inclusion || eligibility.exclusion)
      ? { eligibility }
      : null
  }, [eligibility])

  // Build when both inputs exist
  const ready =
    !!effectiveAlg?.eligibility && formMap && Object.keys(formMap).length > 0

  const outlineSections = useMemo(
    () =>
      ready
        ? buildEligibilitySections(effectiveAlg, { formMap, groupNames })
        : [],
    [ready, effectiveAlg, formMap, groupNames]
  )

  const booleanLines = useMemo(
    () => buildBooleanRich(effectiveAlg),
    [effectiveAlg]
  )

  // DEBUG
  const debugInfo = {
    formMapKeys: Object.keys(formMap).length,
    groupNamesCount: Object.keys(groupNames).length,
    algSource,
    coercionSource: _source,
    coerced: _coerced,
    hasEligibility: !!effectiveAlg?.eligibility,
    inclusionType: typeof eligibility?.inclusion,
    exclusionType: typeof eligibility?.exclusion,
    ready,
    outlineSectionCount: outlineSections.length,
    outlineSectionTitles: outlineSections.map((s: any) => s.title),
    formLoading,
    formError,
    algLoading,
    algError,
  }
  if (DEBUG) {
    // eslint-disable-next-line no-console
    console.debug('[MatchInfoDetails] debug', debugInfo)
  }

  // Boolean view
  if (viewMode === 'boolean') {
    const lines = booleanLines || []
    const visible = isFilterActive
      ? lines.filter((ln) => (ln.kind === 'leaf' ? ln.matched !== false : true))
      : lines

    return (
      <div className="rounded-lg border bg-white p-4">
        {DEBUG && (
          <pre className="text-xs bg-gray-50 border p-2 rounded mb-3">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        )}
        <div className="text-sm leading-6">
          {visible.map((ln, i) => {
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
                      <span className="ml-2 text-gray-500 italic">
                        {ln.trailingJoiner}
                      </span>
                    ) : null}
                  </div>
                )
              case 'leaf': {
                const bg = isHighlightActive
                  ? ln.matched === true
                    ? 'bg-blue-50'
                    : ln.matched === false
                    ? 'bg-red-50'
                    : !isFilterActive
                    ? 'bg-amber-50'
                    : undefined
                  : undefined

                return (
                  <div
                    key={i}
                    style={{ paddingLeft: ln.indent }}
                    className={bg}
                  >
                    <span className="whitespace-pre-wrap">{ln.field} </span>
                    <span className="italic text-gray-500">{ln.opText}</span>
                    {ln.valueText ? (
                      <>
                        {' '}
                        <span className="text-red-700">{ln.valueText}</span>
                        <span className="inline-block align-middle mx-1 text-red-700">
                          {ln.matched === false
                            ? '✕'
                            : ln.matched === true
                            ? '✓'
                            : ''}
                        </span>
                      </>
                    ) : null}
                    {ln.trailingJoiner ? (
                      <span className="ml-2 text-gray-500 italic">
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

  // Outline view
  if (!ready) {
    return (
      <div className="rounded-lg border bg-white p-4 text-sm">
        <div className="font-semibold">Preparing eligibility outline…</div>
        {formLoading && (
          <div className="text-gray-500 mt-1">Loading match form…</div>
        )}
        {(algLoading || !effectiveAlg) && (
          <div className="text-gray-500 mt-1">Loading match details…</div>
        )}
        {(formError || algError) && (
          <div className="text-red-700 mt-1">
            {formError ? `Form error: ${String(formError)}` : null}
            {algError ? ` Match error: ${String(algError)}` : null}
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
    <div className="space-y-4">
      {DEBUG && (
        <pre className="text-xs bg-gray-50 border p-2 rounded">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      )}

      {outlineSections.map((sec) => {
        const visible = sec.items.filter(
          (it) => !(isFilterActive && it.matched === false)
        )
        return (
          <details key={sec.id} className="rounded-lg border bg-white" open>
            <summary className="cursor-pointer select-none list-none p-3 font-semibold">
              {sec.title}{' '}
              {sec.status === 'met' && (
                <span className="ml-2 text-green-600">
                  (Screening Criteria Met)
                </span>
              )}
              {sec.status === 'not_met' && (
                <span className="ml-2 text-red-600">
                  (Screening Criteria Not Met)
                </span>
              )}
              {sec.status === 'unknown' && (
                <span className="ml-2 text-gray-500">
                  (Screening Criteria Unknown)
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
              />
            )}
          </details>
        )
      })}
    </div>
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
  matchInfoAlgorithm: PropTypes.object.isRequired,
  matchInfoId: PropTypes.string,
  matchDetailsUrl: PropTypes.string,
  viewMode: PropTypes.oneOf(['outline', 'boolean']),
}

export default MatchInfoDetails
