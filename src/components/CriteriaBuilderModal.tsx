import { XCircle } from 'react-feather'
import {
  Builder,
  BuilderProps,
  JsonGroup,
  Query,
  Utils as QbUtils,
} from '@react-awesome-query-builder/ui'
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { MatchFormConfig, StudyAlgorithmEngine } from '../model'
import { queryBuilderValueToAlgorithm } from '../utils'
import {
  createStudyAlgorithm,
  updateStudyAlgorithm,
} from '../api/studyAlgorithm'
import { useQueryBuilderState } from '../hooks/useQueryBuilderState'
import { ErrorRetry } from './ErrorRetry'
import Button from './Inputs/Button'

export function CriteriaBuilderModal({
  matchForm,
  studyVersionId,
  closeModal,
  setUpdated,
}: {
  matchForm: MatchFormConfig
  studyVersionId: number
  closeModal: () => void
  setUpdated: Dispatch<SetStateAction<boolean>>
}) {
  const timerIdRef = useRef<NodeJS.Timer | null>(null)
  const [
    studyVersion,
    queryBuilderState,
    loadingStatus,
    fetchQueryBuilderState,
    onChange,
  ] = useQueryBuilderState(studyVersionId, matchForm)

  const renderBuilder = (props: BuilderProps) => (
    <div className="query-builder-container" style={{ padding: '10px' }}>
      <div className="query-builder qb-lite">
        <Builder {...props} />
      </div>
    </div>
  )

  const saveCriteria = () => {
    if (studyVersion) {
      const studyAlgorithm = queryBuilderValueToAlgorithm(
        QbUtils.getTree(queryBuilderState.tree) as JsonGroup
      )
      const studyAlgorithmId =
        studyVersion.eligibility_criteria_infos[0].study_algorithm_engine_id ||
        0
      const eligibilityCriteriaId =
        studyVersion.eligibility_criteria_infos[0].eligibility_criteria_id
      const studyAlgorithmEngine: StudyAlgorithmEngine = {
        id: studyAlgorithmId,
        algorithm_logic: studyAlgorithm,
      }
      const saveResponse = studyAlgorithmId
        ? updateStudyAlgorithm(studyAlgorithmEngine, eligibilityCriteriaId)
        : createStudyAlgorithm(
            studyAlgorithmEngine,
            eligibilityCriteriaId,
            studyVersionId
          )

      saveResponse
        .then(() => {
          closeModal()
          setUpdated(true)
          timerIdRef.current = setTimeout(() => setUpdated(false), 3000)
        })
        .catch(console.error)
    }
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
              {studyVersion && (
                <span className="italic block">
                  {studyVersion.study.code}: {studyVersion.study.name}
                </span>
              )}
            </h3>
            <div className="min-w-max">
              <Button onClick={saveCriteria}>Save</Button>
              <button
                className="ml-4 hover:text-red-700"
                onClick={closeModal}
                aria-label="Close Eligibility Criteria dialog"
              >
                <XCircle className="inline" />
              </button>
            </div>
          </div>
          {loadingStatus === 'not started' || loadingStatus === 'sending' ? (
            <div>Loading...</div>
          ) : loadingStatus === 'error' ? (
            <ErrorRetry retry={fetchQueryBuilderState} />
          ) : (
            <Query
              {...queryBuilderState.config}
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
