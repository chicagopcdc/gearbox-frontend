import DropdownSection from './DropdownSection'
import TrialCard from './TrialCard'
import type {
  MatchDetails,
  MatchGroupCounts,
  MatchGroups,
  Study,
} from '../model'
import TrialMatchInfo from './TrialMatchInfo'
import { MapPin } from 'react-feather'
import { useModal } from '../hooks/useModal'
import TrialMapModal from './TrialMapModal'

type MatchGroupKey = keyof MatchGroups

type MatchResultProps = {
  matchDetails: MatchDetails
  matchGroups: MatchGroups
  allMatchGroups: MatchGroups
  studies: Study[]
  matchCounts: MatchGroupCounts
  pageSize: number
  matchPages: Record<MatchGroupKey, number>
  onChangeMatchPage: (group: MatchGroupKey, direction: -1 | 1) => void
  onSetMatchPage: (group: MatchGroupKey, page: number) => void
  patientValuesByFieldName?: Record<string, unknown>
}

function MatchResult({
  matchDetails,
  matchGroups,
  allMatchGroups,
  studies,
  matchCounts,
  pageSize,
  matchPages,
  onChangeMatchPage,
  onSetMatchPage,
  patientValuesByFieldName = {},
}: MatchResultProps) {
  const [showMap, openMap, closeMap] = useModal()
  const { matched = [], undetermined = [], unmatched = [] } = matchGroups

  const studyById: { [id: number]: Study } = {}
  for (const study of studies) studyById[study.id] = study

  function getPageItems(currentPage: number, pageCount: number) {
    if (pageCount <= 7) {
      return Array.from({ length: pageCount }, (_, index) => index + 1)
    }

    const pages = new Set<number>([1, pageCount, currentPage])

    if (currentPage > 1) pages.add(currentPage - 1)
    if (currentPage < pageCount) pages.add(currentPage + 1)

    if (currentPage <= 3) {
      pages.add(2)
      pages.add(3)
      pages.add(4)
    }

    if (currentPage >= pageCount - 2) {
      pages.add(pageCount - 1)
      pages.add(pageCount - 2)
      pages.add(pageCount - 3)
    }

    const sortedPages = Array.from(pages)
      .filter((page) => page >= 1 && page <= pageCount)
      .sort((a, b) => a - b)

    const pageItems: Array<number | 'ellipsis'> = []

    sortedPages.forEach((page, index) => {
      const previousPage = sortedPages[index - 1]

      if (previousPage && page - previousPage > 1) {
        pageItems.push('ellipsis')
      }

      pageItems.push(page)
    })

    return pageItems
  }

  function renderPagination(group: MatchGroupKey, label: string) {
    const total = matchCounts[group]

    if (total <= pageSize) return null

    const currentPage = matchPages[group]
    const pageCount = Math.ceil(total / pageSize)
    const start = (currentPage - 1) * pageSize + 1
    const end = Math.min(currentPage * pageSize, total)

    return (
      <div className="mb-4 mt-2 flex items-center justify-between rounded border border-gray-200 bg-white px-3 py-2 text-sm">
        <span>
          {label}: {start}-{end} of {total}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded border px-2 py-1 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => onChangeMatchPage(group, -1)}
          >
            Previous
          </button>

          <div className="flex items-center gap-1">
            {getPageItems(currentPage, pageCount).map((pageItem, index) =>
              pageItem === 'ellipsis' ? (
                <span key={`ellipsis-${index}`} className="px-1">
                  ...
                </span>
              ) : (
                <button
                  key={pageItem}
                  type="button"
                  aria-current={pageItem === currentPage ? 'page' : undefined}
                  className={`rounded border px-2 py-1 ${
                    pageItem === currentPage ? 'font-bold bg-gray-100' : ''
                  }`}
                  disabled={pageItem === currentPage}
                  onClick={() => onSetMatchPage(group, pageItem)}
                >
                  {pageItem}
                </button>
              )
            )}
          </div>

          <button
            type="button"
            className="rounded border px-2 py-1 disabled:opacity-50"
            disabled={currentPage === pageCount}
            onClick={() => onChangeMatchPage(group, 1)}
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  function renderTrialCards(ids: number[], overallStatus: boolean | undefined) {
    return ids.map((id) => {
      const study = studyById[id]

      if (!study) return null

      return (
        <TrialCard study={study} key={id}>
          {matchDetails[id] && (
            <TrialMatchInfo
              overallStatus={overallStatus}
              patientValues={patientValuesByFieldName}
              study={study}
              studyMatchInfo={matchDetails[id]}
            />
          )}
        </TrialCard>
      )
    })
  }

  return (
    <>
      <div className="mb-3 flex justify-end">
        <button
          className="flex items-center gap-2 rounded border border-primary px-3 py-2 font-bold text-primary hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={openMap}
          type="button"
        >
          <MapPin size="1rem" />
          Map View
        </button>
      </div>

      {showMap && (
        <TrialMapModal
          closeModal={closeMap}
          matchGroups={allMatchGroups}
          studies={studies}
        />
      )}

      <DropdownSection name={`Matched (${matchCounts.matched})`}>
        <div className="mx-2">
          {renderTrialCards(matched, true)}
          {renderPagination('matched', 'Matched')}
        </div>
      </DropdownSection>

      <DropdownSection name={`Potential Match (${matchCounts.undetermined})`}>
        <div className="mx-2">
          {renderTrialCards(undetermined, undefined)}
          {renderPagination('undetermined', 'Potential Match')}
        </div>
      </DropdownSection>

      <DropdownSection name={`Unmatched (${matchCounts.unmatched})`}>
        <div className="mx-2">
          {renderTrialCards(unmatched, false)}
          {renderPagination('unmatched', 'Unmatched')}
        </div>
      </DropdownSection>
    </>
  )
}

export default MatchResult
