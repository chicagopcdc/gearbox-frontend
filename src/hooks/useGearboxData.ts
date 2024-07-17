import { useState, useEffect } from 'react'
import type {
  ApiStatus,
  EligibilityCriterion,
  ImportantQuestionConfig,
  MatchCondition,
  MatchFormConfig,
  Study,
} from '../model'
import { getEligibilityCriteria } from '../api/eligibilityCriteria'
import { getMatchConditions } from '../api/matchConditions'
import { getMatchFormConfig } from '../api/matchFormConfig'
import { getStudies } from '../api/studies'
import type useAuth from './useAuth'
import { getImportantQuestionsConfig } from '../api/importantQuestionsConfig'

export default function useGearboxData(auth: ReturnType<typeof useAuth>) {
  const [conditions, setConditions] = useState([] as MatchCondition[])
  const [config, setConfig] = useState({
    groups: [],
    fields: [],
  } as MatchFormConfig)
  const [criteria, setCriteria] = useState([] as EligibilityCriterion[])
  const [studies, setStudies] = useState([] as Study[])
  const [status, setStatus] = useState<ApiStatus>('not started')
  const [importantQuestionsConfig, setImportantQuestionsConfig] =
    useState<ImportantQuestionConfig>({ groups: [] })

  const fetchAll = () => {
    setStatus('sending')
    Promise.all([
      getMatchConditions(),
      getMatchFormConfig(),
      getEligibilityCriteria(),
      getStudies(),
      getImportantQuestionsConfig(),
    ])
      .then(
        ([conditions, config, criteria, studies, importantQuestionsConfig]) => {
          setConditions(conditions)
          setConfig(config)
          setCriteria(criteria)
          setStudies(studies)
          setStatus('not started')
          setImportantQuestionsConfig(importantQuestionsConfig)
        }
      )
      .catch((err) => {
        console.error(err)
        setStatus('error')
      })
  }
  const resetAll = () => {
    setConditions([])
    setConfig({ groups: [], fields: [] } as MatchFormConfig)
    setCriteria([])
    setStudies([])
    setImportantQuestionsConfig({ groups: [] })
  }

  useEffect(() => {
    if (auth.isRegistered) fetchAll() // load data on login
    else resetAll() // clear data on logout
  }, [auth.isRegistered])

  return {
    action: {
      fetchAll,
    },
    state: {
      conditions,
      config,
      criteria,
      studies,
    },
    status,
    importantQuestionsConfig,
  }
}
