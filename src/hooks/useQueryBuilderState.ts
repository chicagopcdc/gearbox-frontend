import { ApiStatus, Criterion, MatchFormConfig, StudyVersion } from '../model'
import {
  Config,
  ImmutableTree,
  Utils as QbUtils,
} from '@react-awesome-query-builder/ui'
import { useCallback, useEffect, useState } from 'react'
import { getEligibilityCriteriaById } from '../api/eligibilityCriteria'
import { getStudyAlgorithm } from '../api/studyAlgorithm'
import {
  getInitQueryValue,
  getQueryBuilderConfig,
  getQueryBuilderValue,
  initialQueryBuilderConfig,
} from '../utils'
import { getStudyVersionById } from '../api/studyVersions'

export interface QueryBuilderState {
  tree: ImmutableTree
  config: Config
}

export function useQueryBuilderState(
  studyVersionId: number,
  matchForm: MatchFormConfig,
  criteriaNotInMatchForm: Criterion[]
): [
  StudyVersion | null,
  QueryBuilderState,
  ApiStatus,
  () => void,
  (immutableTree: ImmutableTree, config: Config) => void
] {
  const [queryBuilderState, setQueryBuilderState] = useState<QueryBuilderState>(
    {
      tree: QbUtils.checkTree(
        QbUtils.loadTree(getInitQueryValue()),
        initialQueryBuilderConfig
      ),
      config: initialQueryBuilderConfig,
    }
  )

  const [loadingStatus, setLoadingStatus] = useState<ApiStatus>('not started')

  const [studyVersion, setStudyVersion] = useState<StudyVersion | null>(null)
  const fetchQueryBuilderState = async (svId: number, mf: MatchFormConfig) => {
    setLoadingStatus('sending')
    try {
      const sv = await getStudyVersionById(svId)
      setStudyVersion(sv)

      const {
        eligibility_criteria_id: ecId,
        study_algorithm_engine_id: saId,
      } = sv

      const eligibilityCriteria = await getEligibilityCriteriaById(ecId)
      const queryBuilderConfig = getQueryBuilderConfig(
        matchForm.fields,
        eligibilityCriteria,
        criteriaNotInMatchForm
      )

      if (saId) {
        const algorithm = await getStudyAlgorithm(saId)
        const queryValue = getQueryBuilderValue(
          algorithm,
          eligibilityCriteria,
          mf,
          criteriaNotInMatchForm
        )
        setQueryBuilderState((prevState) => ({
          ...prevState,
          tree: QbUtils.checkTree(
            QbUtils.loadTree(queryValue),
            queryBuilderConfig
          ),
          config: queryBuilderConfig,
        }))
      } else {
        setQueryBuilderState((prevState) => ({
          ...prevState,
          tree: QbUtils.checkTree(
            QbUtils.loadTree(getInitQueryValue()),
            queryBuilderConfig
          ),
          config: queryBuilderConfig,
        }))
      }

      setLoadingStatus('success')
    } catch (err) {
      console.error(err)
      setLoadingStatus('error')
    }
  }

  useEffect(() => {
    fetchQueryBuilderState(studyVersionId, matchForm)
  }, [studyVersionId, matchForm])

  const onChange = useCallback(
    (immutableTree: ImmutableTree, config: Config) => {
      setQueryBuilderState((prevState) => ({
        ...prevState,
        tree: immutableTree,
        config,
      }))
    },
    []
  )
  return [
    studyVersion,
    queryBuilderState,
    loadingStatus,
    () => fetchQueryBuilderState(studyVersionId, matchForm),
    onChange,
  ]
}
