import { XCircle } from 'react-feather'
import {
  Builder,
  BuilderProps,
  Config,
  JsonGroup,
  Query,
  Utils as QbUtils,
} from '@react-awesome-query-builder/ui'
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { MatchFormConfig, StudyVersion } from '../model'
import { queryBuilderValueToAlgorithm } from '../utils'
import { updateStudyAlgorithm } from '../api/studyAlgorithm'
import { useQueryBuilderState } from '../hooks/useQueryBuilderState'
import { ErrorRetry } from './ErrorRetry'
import Button from './Inputs/Button'

export function CriteriaBuilderModal({
  matchForm,
  studyVersion,
  closeModal,
  queryBuilderConfig,
  setUpdated,
}: {
  matchForm: MatchFormConfig
  studyVersion: StudyVersion
  closeModal: () => void
  queryBuilderConfig: Config
  setUpdated: Dispatch<SetStateAction<boolean>>
}) {
  const timerIdRef = useRef<NodeJS.Timer | null>(null)
  const {
    study,
    eligibility_criteria_infos: [
      {
        eligibility_criteria_id: eligibilityCriteriaId,
        study_algorithm_engine_id: studyAlgorithmId,
      },
    ],
  } = studyVersion

  const [queryBuilderState, loadingStatus, fetchQueryBuilderState, onChange] =
    useQueryBuilderState(
      eligibilityCriteriaId,
      studyAlgorithmId,
      matchForm,
      queryBuilderConfig
    )
  const renderBuilder = (props: BuilderProps) => (
    <div className="query-builder-container" style={{ padding: '10px' }}>
      <div className="query-builder qb-lite">
        <Builder {...props} />
      </div>
    </div>
  )

  const saveCriteria = (studyAlgorithmId: number) => () => {
    const studyAlgorithm = queryBuilderValueToAlgorithm(
      QbUtils.getTree(queryBuilderState.tree) as JsonGroup
    )
    updateStudyAlgorithm(
      {
        id: studyAlgorithmId,
        algorithm_logic: studyAlgorithm,
      },
      eligibilityCriteriaId
    ).then(() => {
      closeModal()
      setUpdated(true)
      timerIdRef.current = setTimeout(() => setUpdated(false), 3000)
    })
  }

  useEffect(
    () => () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current)
      }
    },
    []
  )
  return (
    <div
      id="match-info-modal"
      className="fixed w-screen h-screen left-0 top-0 flex items-center justify-center z-50"
      style={{ background: '#cccc' }}
      role="dialog"
      aria-labelledby="eligibility-criteria-dialog-title"
      aria-modal="true"
    >
      <div
        className="bg-white overflow-scroll w-full lg:w-3/4 xl:w-2/3 h-full"
        style={{ maxHeight: '95%', maxWidth: '95%' }}
      >
        <div className="text-sm sm:text-base px-4 pb-4 pt-2 sm:px-8 sm:pb-8 relative">
          <div className="flex items-baseline justify-between border-b py-2 sm:py-4 mb-4 z-10 sticky top-0 bg-white">
            <h3
              id="eligibility-criteria-dialog-title"
              className="font-bold mr-4"
            >
              <span className="text-gray-500 text-sm">
                Eligibility Criteria for{' '}
              </span>
              <span className="italic block">
                {study.code}: {study.name}
              </span>
            </h3>
            <div className="min-w-max">
              {!!studyAlgorithmId && (
                <Button onClick={saveCriteria(studyAlgorithmId)}>Save</Button>
              )}
              <button
                className="ml-4 hover:text-red-700"
                onClick={closeModal}
                aria-label="Close Eligibility Criteria dialog"
              >
                <XCircle className="inline" />
              </button>
            </div>
          </div>
          {!studyAlgorithmId ? (
            <h2 className="font-bold m-4 text-lg">
              No Study Algorithm Set Yet
            </h2>
          ) : loadingStatus === 'not started' || loadingStatus === 'loading' ? (
            <div>Loading...</div>
          ) : loadingStatus === 'error' ? (
            <ErrorRetry retry={fetchQueryBuilderState} />
          ) : (
            <Query
              {...queryBuilderConfig}
              value={queryBuilderState.tree}
              onChange={onChange}
              renderBuilder={renderBuilder}
            />
          )}
        </div>
      </div>
    </div>
  )
}
