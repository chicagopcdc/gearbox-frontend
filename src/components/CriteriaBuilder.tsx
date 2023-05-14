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
      {/*<div className="query-builder-result">*/}
      {/*  <div>*/}
      {/*    Query string:{' '}*/}
      {/*    <pre>*/}
      {/*      {JSON.stringify(*/}
      {/*        QbUtils.queryString(*/}
      {/*          queryBuilderState.tree,*/}
      {/*          queryBuilderState.config*/}
      {/*        )*/}
      {/*      )}*/}
      {/*    </pre>*/}
      {/*  </div>*/}
      {/*  <div>*/}
      {/*    MongoDb query:{' '}*/}
      {/*    <pre>*/}
      {/*      {JSON.stringify(*/}
      {/*        QbUtils.mongodbFormat(*/}
      {/*          queryBuilderState.tree,*/}
      {/*          queryBuilderState.config*/}
      {/*        )*/}
      {/*      )}*/}
      {/*    </pre>*/}
      {/*  </div>*/}
      {/*  <div>*/}
      {/*    SQL where:{' '}*/}
      {/*    <pre>*/}
      {/*      {JSON.stringify(*/}
      {/*        QbUtils.sqlFormat(*/}
      {/*          queryBuilderState.tree,*/}
      {/*          queryBuilderState.config*/}
      {/*        )*/}
      {/*      )}*/}
      {/*    </pre>*/}
      {/*  </div>*/}
      {/*  <div>*/}
      {/*    JsonLogic:{' '}*/}
      {/*    <pre>*/}
      {/*      {JSON.stringify(*/}
      {/*        QbUtils.jsonLogicFormat(*/}
      {/*          queryBuilderState.tree,*/}
      {/*          queryBuilderState.config*/}
      {/*        )*/}
      {/*      )}*/}
      {/*    </pre>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  )
}
