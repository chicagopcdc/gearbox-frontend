import { LoadingStatus, MatchFormConfig } from '../model'
import {
  Config,
  ImmutableTree,
  Utils as QbUtils,
} from '@react-awesome-query-builder/ui'
import { useCallback, useEffect, useState } from 'react'
import { getEligibilityCriteriaById } from '../api/eligibilityCriteria'
import { getStudyAlgorithm } from '../api/studyAlgorithm'
import { getInitQueryValue, getQueryBuilderValue } from '../utils'

interface QueryBuilderState {
  tree: ImmutableTree
  config: Config
}

export function useQueryBuilderState(
  eligibilityCriteriaId: number,
  studyAlgorithmId: number,
  matchForm: MatchFormConfig,
  queryBuilderConfig: Config
): [
  QueryBuilderState,
  LoadingStatus,
  () => void,
  (immutableTree: ImmutableTree, config: Config) => void
] {
  const [queryBuilderState, setQueryBuilderState] = useState<QueryBuilderState>(
    {
      tree: QbUtils.checkTree(
        QbUtils.loadTree(getInitQueryValue()),
        queryBuilderConfig
      ),
      config: queryBuilderConfig,
    }
  )

  const [loadingStatus, setLoadingStatus] =
    useState<LoadingStatus>('not started')
  const fetchQueryBuilderState = (
    ecId: number,
    saId: number,
    mf: MatchFormConfig,
    qbc: Config
  ) => {
    setLoadingStatus('loading')
    getEligibilityCriteriaById(ecId)
      .then((criteria) => {
        getStudyAlgorithm(saId).then((algorithm) => {
          const queryValue = getQueryBuilderValue(algorithm, criteria, mf)
          setQueryBuilderState((prevState) => ({
            ...prevState,
            tree: QbUtils.checkTree(QbUtils.loadTree(queryValue), qbc),
            config: qbc,
          }))
          setLoadingStatus('success')
        })
      })
      .catch((err) => {
        console.error(err)
        setLoadingStatus('error')
      })
  }

  useEffect(() => {
    fetchQueryBuilderState(
      eligibilityCriteriaId,
      studyAlgorithmId,
      matchForm,
      queryBuilderConfig
    )
  }, [eligibilityCriteriaId, studyAlgorithmId, matchForm, queryBuilderConfig])

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
    queryBuilderState,
    loadingStatus,
    () =>
      fetchQueryBuilderState(
        eligibilityCriteriaId,
        studyAlgorithmId,
        matchForm,
        queryBuilderConfig
      ),
    onChange,
  ]
}
