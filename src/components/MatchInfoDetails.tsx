/* eslint-disable react/prop-types */
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { buildEligibilitySections } from './trialMatch/sectionBuilder' // outline format
import { buildBooleanRich } from './trialMatch/booleanBuilder' // boolean format

function RenderItems({
  items,
  isHighlightActive,
  isFilterActive,
}: {
  items: Array<{
    text?: string
    matched?: boolean
    children?: any[]
    logic?: 'all' | 'any'
  }>
  isHighlightActive: boolean
  isFilterActive: boolean
}) {
  if (!items?.length) return null
  return (
    <ul className="p-4 list-disc pl-6">
      {items.map((it, i) => {
        const liClass = isHighlightActive
          ? it.matched === true
            ? 'bg-blue-50'
            : it.matched === false
            ? 'bg-red-50'
            : !isFilterActive
            ? 'bg-amber-50'
            : undefined
          : undefined

        return (
          <li key={i} className={liClass}>
            {it.text ? (
              <span className="whitespace-pre-wrap">
                {it.text}
                {it.children && it.children.length > 0 && it.logic && (
                  <span className="ml-2 text-xs text-gray-500">
                    ({it.logic.toUpperCase()})
                  </span>
                )}
              </span>
            ) : null}
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

type MatchInfoDetailsProps = {
  isFilterActive?: boolean
  isHighlightActive?: boolean
  matchInfoAlgorithm: any
  matchInfoId?: string
  viewMode?: 'outline' | 'boolean'
}

const MatchInfoDetails: React.FC<MatchInfoDetailsProps> = ({
  isFilterActive = false,
  isHighlightActive = false,
  matchInfoAlgorithm,
  viewMode = 'outline',
}) => {
  // For Outline (sectioned) view
  const outlineSections = useMemo(
    () => buildEligibilitySections(matchInfoAlgorithm),
    [matchInfoAlgorithm]
  )

  // For Boolean rich lines (JSX rendering)
  const booleanLines = useMemo(
    () => buildBooleanRich(matchInfoAlgorithm),
    [matchInfoAlgorithm]
  )

  if (viewMode === 'boolean') {
    const lines = booleanLines

    // Apply filter: only drop unmatched on LEAF items (narrow the union)
    const visible = isFilterActive
      ? lines.filter((ln) => (ln.kind === 'leaf' ? ln.matched !== false : true))
      : lines

    return (
      <div className="rounded-lg border bg-white p-4">
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

  // Outline view (existing behaviour)
  return (
    <div className="space-y-4">
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
              {sec.status === 'not-met' && (
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
  viewMode: PropTypes.oneOf(['outline', 'boolean']),
}

export default MatchInfoDetails
