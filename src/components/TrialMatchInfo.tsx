import { useEffect, useState } from 'react'
import { Info, XCircle } from 'react-feather'
import ReactTooltip from 'react-tooltip'
import type { MatchInfoAlgorithm } from '../model'
import MatchInfoDetails from './MatchInfoDetails'

type TrialMatchInfoProps = {
  studyId: number
  studyMatchInfo: MatchInfoAlgorithm
  studyTitle: string
}

function TrialMatchInfo({
  studyId,
  studyMatchInfo,
  studyTitle,
}: TrialMatchInfoProps) {
  const matchInfoId = `match-info-${studyId}`

  const [showModal, setShowModal] = useState(false)
  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)
  useEffect(() => {
    return closeModal
  }, [])
  useEffect(() => {
    function closeModalOnEscape(e: KeyboardEvent) {
      if (showModal && e.key === 'Escape') closeModal()
    }
    let isMissingEventListener = true

    if (isMissingEventListener && showModal) {
      window.addEventListener('keydown', closeModalOnEscape)
      isMissingEventListener = false
    }

    return () => {
      window.removeEventListener('keydown', closeModalOnEscape)
    }
  }, [showModal])

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
          className="fixed w-screen h-screen left-0 top-0 flex items-center justify-center z-10"
          style={{ background: '#cccc' }}
          role="dialog"
          aria-labelledby="eligibility-criteria-dialog-title"
          aria-modal="true"
        >
          <div
            className="bg-white overflow-scroll"
            style={{ maxHeight: '95%', maxWidth: '95%' }}
          >
            <div className="text-sm sm:text-base p-4 sm:p-8">
              <div className="flex justify-between border-b pb-4 mb-4">
                <h3
                  id="eligibility-criteria-dialog-title"
                  className="font-bold mr-4"
                >
                  Eligibility Criteria for {studyTitle}
                </h3>
                <button
                  className="hover:text-red-700"
                  onClick={closeModal}
                  aria-label="Close Eligibility Criteria dialog"
                >
                  <XCircle />
                </button>
              </div>
              <MatchInfoDetails
                matchInfoId={matchInfoId}
                matchInfoAlgorithm={studyMatchInfo}
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
