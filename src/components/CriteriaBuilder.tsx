import React from 'react'
import { MatchingPageProps } from '../pages/MatchingPage'
import { Edit } from 'react-feather'
import ReactTooltip from 'react-tooltip'
import { StudyVersion } from '../model'
import { useModal } from '../hooks/useModal'
import { CriteriaBuilderModal } from './CriteriaBuilderModal'
import { getQueryBuilderConfig } from '../utils'

export function CriteriaBuilder({
  gearboxState,
  studyVersion,
}: {
  gearboxState: MatchingPageProps['state']
  studyVersion: StudyVersion
}) {
  const { study } = studyVersion
  const matchInfoId = `match-info-${study.id}`

  const [showModal, openModal, closeModal] = useModal()

  return (
    <div>
      <button
        className={`mr-2 ${showModal ? 'text-red-700' : 'hover:text-red-700'}`}
        onClick={openModal}
        data-tip
        data-for={matchInfoId}
        aria-label="Open Edit Eligibility Criteria dialog"
      >
        <Edit />
      </button>

      {showModal ? (
        <CriteriaBuilderModal
          matchForm={gearboxState.config}
          studyVersion={studyVersion}
          closeModal={closeModal}
          queryBuilderConfig={getQueryBuilderConfig(gearboxState.config.fields)}
        />
      ) : (
        <ReactTooltip
          id={matchInfoId}
          border
          borderColor="black"
          effect="solid"
          type="light"
        >
          <span>Click to edit Eligibility Criteria</span>
        </ReactTooltip>
      )}
    </div>
  )
}
