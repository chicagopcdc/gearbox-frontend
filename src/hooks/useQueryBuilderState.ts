import { LoadingStatus, MatchFormConfig, StudyVersion } from '../model'
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

interface QueryBuilderState {
  tree: ImmutableTree
  config: Config
}

export function useQueryBuilderState(
  studyVersionId: number,
  matchForm: MatchFormConfig
): [
  StudyVersion | null,
  QueryBuilderState,
  LoadingStatus,
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

  const [loadingStatus, setLoadingStatus] =
    useState<LoadingStatus>('not started')

  const [studyVersion, setStudyVersion] = useState<StudyVersion | null>(null)
  const fetchQueryBuilderState = (svId: number, mf: MatchFormConfig) => {
    setLoadingStatus('loading')
    getStudyVersionById(svId)
      .then((sv) => {
        setStudyVersion(sv)
        const {
          eligibility_criteria_infos: [
            { eligibility_criteria_id: ecId, study_algorithm_engine_id: saId },
          ],
        } = sv
        getEligibilityCriteriaById(ecId).then((criteria) => {
          const queryBuilderConfig = getQueryBuilderConfig(
            matchForm.fields,
            criteria
          )
          if (saId) {
            getStudyAlgorithm(saId).then((algorithm) => {
              const queryValue = getQueryBuilderValue(algorithm, criteria, mf)
              setQueryBuilderState((prevState) => ({
                ...prevState,
                tree: QbUtils.checkTree(
                  QbUtils.loadTree(queryValue),
                  queryBuilderConfig
                ),
                config: queryBuilderConfig,
              }))
              setLoadingStatus('success')
            })
          } else {
            setQueryBuilderState((prevState) => ({
              ...prevState,
              tree: QbUtils.checkTree(
                QbUtils.loadTree(getInitQueryValue()),
                queryBuilderConfig
              ),
              config: queryBuilderConfig,
            }))
            setLoadingStatus('success')
          }
        })
      })
      .catch((err) => {
        console.error(err)
        setLoadingStatus('error')
      })
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
