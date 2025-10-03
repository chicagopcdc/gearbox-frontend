/* eslint-disable react/prop-types */
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { buildEligibilitySections } from './trialMatch/sectionBuilder' // builds the 6 sections from raw payload
// ^ This function takes the complex eligibility payload and returns:
//   [{ id, title, status, items: [{ text, matched?, children?, logic? }, ...] }, ...]
//   - items can be nested (children) when the source had grouped AND/OR rules.  :contentReference[oaicite:0]{index=0}

// ---------------------------------------------
// Small recursive renderer for nested rule items
// ---------------------------------------------
function RenderItems({
  items,
  isHighlightActive,
}: {
  // items is an array of leaf or group nodes:
  // - Leaf:   { text: string, matched?: boolean }
  // - Parent: { text?: string, logic?: 'all'|'any', children: SectionItem[] }
  items: Array<{
    text?: string
    matched?: boolean
    children?: any[]
    logic?: 'all' | 'any'
  }>
  // When highlight is on, we tint matched/unmatched bullets
  isHighlightActive: boolean
}) {
  if (!items?.length) return null

  // Render one <ul> for this level
  return (
    <ul className="p-4 list-disc pl-6">
      {items.map((it, i) => {
        // Choose background by match state (only when user wants highlighting)
        const liClass =
          isHighlightActive && it.matched === false
            ? 'bg-red-50'
            : isHighlightActive && it.matched === true
            ? 'bg-blue-50'
            : undefined

        return (
          <li key={i} className={liClass}>
            {/* Parent bullets sometimes have only a label like "All of the following" */}
            {it.text ? (
              <span className="whitespace-pre-wrap">
                {it.text}
                {/* For grouped nodes, show which logic the group represents (AND/OR) */}
                {it.children && it.children.length > 0 && it.logic && (
                  <span className="ml-2 text-xs text-gray-500">
                    ({it.logic.toUpperCase()})
                  </span>
                )}
              </span>
            ) : null}

            {/* If this is a group, render its children as a nested list */}
            {it.children && it.children.length > 0 && (
              <div className="mt-1">
                <RenderItems
                  items={it.children}
                  isHighlightActive={isHighlightActive}
                />
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

// ---------------------------------------------
// Main details component
// ---------------------------------------------
type MatchInfoDetailsProps = {
  // When on, hides items marked as "matched === false"
  isFilterActive?: boolean
  // When on, tints matched (blue) and unmatched (red) items
  isHighlightActive?: boolean
  // The raw “match info” payload from the API (tree of AND/OR groups + rules)
  matchInfoAlgorithm: any
  // Optional: not used here, but kept for parity with the caller
  matchInfoId?: string
}

const MatchInfoDetails: React.FC<MatchInfoDetailsProps> = ({
  isFilterActive = false,
  isHighlightActive = false,
  matchInfoAlgorithm,
}) => {
  // Build the 6 sections once per payload change
  const sections = useMemo(
    () => buildEligibilitySections(matchInfoAlgorithm),
    [matchInfoAlgorithm]
  )

  return (
    <div className="space-y-4">
      {/* Render each of the 6 sections in a <details> panel */}
      {sections.map((sec) => {
        // Optionally filter out "not matched" items when the toggle is on
        const visible = sec.items.filter(
          (it) => !(isFilterActive && it.matched === false)
        )

        return (
          <details key={sec.id} className="rounded-lg border bg-white" open>
            <summary className="cursor-pointer select-none list-none p-3 font-semibold">
              {/* Section title (e.g., Disease, Organ Function, …) */}
              {sec.title}{' '}
              {/* Badge reflects section-level status derived from child items */}
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

            {/* If no visible items after filtering, show a gentle placeholder */}
            {visible.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 italic">
                No criteria listed.
              </div>
            ) : (
              // Otherwise, render nested bullets (groups become sub-lists)
              <RenderItems
                items={visible}
                isHighlightActive={isHighlightActive}
              />
            )}
          </details>
        )
      })}
    </div>
  )
}

// Sensible defaults for optional props
MatchInfoDetails.defaultProps = {
  isFilterActive: false,
  isHighlightActive: false,
}

// Runtime prop checks (keeps ESLint happy even in TSX projects)
MatchInfoDetails.propTypes = {
  isFilterActive: PropTypes.bool,
  isHighlightActive: PropTypes.bool,
  matchInfoAlgorithm: PropTypes.object.isRequired,
  matchInfoId: PropTypes.string,
}

export default MatchInfoDetails
