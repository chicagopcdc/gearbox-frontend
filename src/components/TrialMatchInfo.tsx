import { useState } from 'react'
import {
  Info,
  MoreHorizontal,
  ToggleLeft,
  ToggleRight,
  XCircle,
  Zap,
  ZapOff,
  Check,
} from 'react-feather'
import ReactTooltip from 'react-tooltip'
import type { MatchInfoAlgorithm, Study } from '../model'
import MatchInfoDetails from './MatchInfoDetails'
import { useModal } from '../hooks/useModal'

type TrialMatchInfoProps = {
  study: Study
  studyMatchInfo: MatchInfoAlgorithm
}

function TrialMatchInfo({ study, studyMatchInfo }: TrialMatchInfoProps) {
  const matchInfoId = `match-info-${study.id}`

  // Modal open/close state and helpers
  const [showModal, openModal, closeModal] = useModal()

  // “Options” menu inside the modal header
  const [showModalOptions, setShowModalOptions] = useState(false)

  // Toggles that affect what <MatchInfoDetails /> shows
  const [isFilterActive, setIsFilterActive] = useState(false)
  const [isHighlightActive, setIsHighlightActive] = useState(false)
  const [viewMode, setViewMode] = useState<'outline' | 'boolean'>('outline')

  const toggleModalOptions = () => setShowModalOptions((show) => !show)
  const toggleFilter = () => setIsFilterActive((isActive) => !isActive)
  const toggleHighlight = () => setIsHighlightActive((isActive) => !isActive)

  // Close the options menu if the user clicks/tabs away
  function handleModalOptionsBlur(e: React.FocusEvent) {
    if (showModalOptions && !e.currentTarget.contains(e.relatedTarget)) {
      setShowModalOptions(false)
    }
  }

  return (
    <>
      <button
        className={`mr-2 ${showModal ? 'text-red-700' : 'hover:text-red-700'}`}
        onClick={openModal}
        data-tip
        data-for={matchInfoId}
        aria-label="Open Eligibility Criteria dialog"
      >
        <Info />
      </button>

      {showModal ? (
        <div
          id="match-info-modal"
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
          role="dialog"
          aria-labelledby="eligibility-criteria-dialog-title"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60"
            onClick={closeModal}
            aria-hidden="true"
          />

          {/* Modal panel */}
          <div className="relative z-10 mt-10 w-full max-w-6xl rounded-lg bg-white shadow-lg">
            <div className="text-sm sm:text-base px-5 pb-5 pt-3 sm:px-10 sm:pb-10">
              {/* Header row */}
              <div className="flex items-baseline justify-between border-b py-2 sm:py-4 mb-4 sticky top-0 bg-white">
                {/* Left: Title */}
                <h3 className="font-semibold">
                  {`Clinical Trial Participation Criteria for Study ${study.code}`}
                </h3>

                {/* Right: Options menu + Close */}
                <div className="flex items-center gap-2">
                  {/* Options menu */}
                  <div className="min-w-max">
                    <div
                      className="inline relative font-normal normal-case text-base"
                      onBlur={handleModalOptionsBlur}
                      tabIndex={0} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
                    >
                      <button
                        className={`p-1 ${
                          showModalOptions
                            ? 'text-primary'
                            : 'hover:text-primary'
                        }`}
                        data-for="match-form-menu"
                        data-tip
                        onClick={toggleModalOptions}
                        aria-haspopup="true"
                        aria-expanded={showModalOptions}
                        aria-controls="criteria-options-menu"
                      >
                        <MoreHorizontal className="inline" />
                        <ReactTooltip
                          border
                          borderColor="black"
                          id="match-form-menu"
                          effect="solid"
                          place="left"
                          type="light"
                        >
                          <span>Options</span>
                        </ReactTooltip>
                      </button>

                      {showModalOptions && (
                        <div
                          id="criteria-options-menu"
                          className="absolute right-0 origin-top-right w-56 bg-white border border-gray-300 shadow-md mt-2 p-1"
                          role="menu"
                        >
                          <ul className="w-full text-sm text-primary">
                            {/* Filter toggle */}
                            <li className="hover:bg-red-100" role="none">
                              <button
                                className={`w-full p-2${
                                  studyMatchInfo.isMatched === false
                                    ? ' bg-gray-100 text-gray-500 cursor-not-allowed'
                                    : ''
                                }`}
                                data-for="match-form-filter"
                                data-tip
                                onClick={toggleFilter}
                                disabled={studyMatchInfo.isMatched === false}
                                role="menuitem"
                              >
                                {isFilterActive ? (
                                  <ToggleRight className="inline" />
                                ) : (
                                  <ToggleLeft className="inline text-gray-500" />
                                )}
                                <span className="mx-2">Filter criteria</span>
                              </button>
                              <ReactTooltip
                                border
                                borderColor="black"
                                id="match-form-filter"
                                effect="solid"
                                place="bottom"
                                type="light"
                              >
                                <div style={{ maxWidth: '200px' }}>
                                  Show only criteria that are relevant to this
                                  match, or show everything.
                                </div>
                              </ReactTooltip>
                            </li>

                            {/* Highlight toggle */}
                            <li className="hover:bg-red-100" role="none">
                              <button
                                className="w-full p-2"
                                data-for="match-form-highlight"
                                data-tip
                                onClick={toggleHighlight}
                                role="menuitem"
                              >
                                {isHighlightActive ? (
                                  <Zap className="inline" />
                                ) : (
                                  <ZapOff className="inline text-gray-500" />
                                )}
                                <span className="mx-2">Highlight status</span>
                              </button>
                              <ReactTooltip
                                border
                                borderColor="black"
                                id="match-form-highlight"
                                effect="solid"
                                place="bottom"
                                type="light"
                              >
                                <div style={{ maxWidth: '200px' }}>
                                  Color matched (blue) and unmatched (red)
                                  criteria.
                                </div>
                              </ReactTooltip>
                            </li>

                            {/* View mode — Outline */}
                            <li className="hover:bg-red-100" role="none">
                              <button
                                className="w-full p-2 text-left"
                                onClick={() => setViewMode('outline')}
                                role="menuitem"
                              >
                                {viewMode === 'outline' ? (
                                  <Check className="inline" />
                                ) : (
                                  <span className="inline-block w-4" />
                                )}
                                <span className="mx-2">Outline Format</span>
                              </button>
                            </li>

                            {/* View mode — Boolean */}
                            <li className="hover:bg-red-100" role="none">
                              <button
                                className="w-full p-2 text-left"
                                onClick={() => setViewMode('boolean')}
                                role="menuitem"
                              >
                                {viewMode === 'boolean' ? (
                                  <Check className="inline" />
                                ) : (
                                  <span className="inline-block w-4" />
                                )}
                                <span className="mx-2">Boolean Format</span>
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Close button */}
                  <button
                    className="p-1 hover:text-red-700"
                    onClick={closeModal}
                    aria-label="Close dialog"
                    aria-haspopup="false"
                  >
                    <XCircle />
                  </button>
                </div>
              </div>

              {/* Modal body: pass options to details renderer */}
              <MatchInfoDetails
                isFilterActive={isFilterActive}
                isHighlightActive={isHighlightActive}
                matchInfoId={matchInfoId}
                matchInfoAlgorithm={studyMatchInfo}
                viewMode={viewMode}
              />
            </div>
          </div>
        </div>
      ) : (
        <ReactTooltip
          id={matchInfoId}
          border
          borderColor="black"
          effect="solid"
          type="light"
        >
          <span>Click to see Eligibility Criteria</span>
        </ReactTooltip>
      )}
    </>
  )
}

export default TrialMatchInfo
