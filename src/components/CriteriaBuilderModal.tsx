import { XCircle } from 'react-feather'
import {
  Builder,
  BuilderProps,
  Config,
  ImmutableTree,
  Query,
  Utils as QbUtils,
} from '@react-awesome-query-builder/ui'
import React, { useCallback, useEffect, useState } from 'react'
import { MatchFormConfig, StudyVersion } from '../model'
import { getInitQueryValue, getQueryBuilderValue } from '../utils'
import { getEligibilityCriteriaById } from '../api/eligibilityCriteria'
import { getStudyAlgorithm } from '../api/studyAlgorithm'
import { useQueryBuilderState } from '../hooks/useQueryBuilderState'
import { ErrorRetry } from './ErrorRetry'

interface QueryBuilderState {
  tree: ImmutableTree
  config: Config
}

export function CriteriaBuilderModal({
  matchForm,
  studyVersion,
  closeModal,
  queryBuilderConfig,
}: {
  matchForm: MatchFormConfig
  studyVersion: StudyVersion
  closeModal: () => void
  queryBuilderConfig: Config
}) {
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
                {study.code}: {study.title}
              </span>
            </h3>
            <div className="min-w-max">
              <button
                className="ml-2 hover:text-red-700"
                onClick={closeModal}
                aria-label="Close Eligibility Criteria dialog"
              >
                <XCircle className="inline" />
              </button>
            </div>
          </div>
          {loadingStatus === 'not started' || loadingStatus === 'loading' ? (
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
