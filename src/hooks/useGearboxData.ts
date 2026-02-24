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
  const [errors, setErrors] = useState<string[]>([])
  const [importantQuestionsConfig, setImportantQuestionsConfig] =
    useState<ImportantQuestionConfig>({ groups: [] })

  const fetchAll = () => {
    setStatus('sending')
    setErrors([])
    Promise.allSettled([
      getMatchConditions(),
      getMatchFormConfig(),
      getEligibilityCriteria(),
      getStudies(),
      getImportantQuestionsConfig(),
    ]).then((results) => {
      const [condResult, configResult, critResult, studyResult, iqResult] =
        results

      if (condResult.status === 'fulfilled') setConditions(condResult.value)
      if (configResult.status === 'fulfilled') setConfig(configResult.value)
      if (critResult.status === 'fulfilled') setCriteria(critResult.value)
      if (studyResult.status === 'fulfilled') setStudies(studyResult.value)
      if (iqResult.status === 'fulfilled')
        setImportantQuestionsConfig(iqResult.value)

      // Labels paired inline with results — no separate array that can drift
      const labeled: [string, PromiseSettledResult<unknown>][] = [
        ['match conditions', condResult],
        ['match form config', configResult],
        ['eligibility criteria', critResult],
        ['studies', studyResult],
        ['important questions config', iqResult],
      ]
      const failures = labeled.filter(([, r]) => r.status === 'rejected') as [
        string,
        PromiseRejectedResult
      ][]

      // Log each failure individually to preserve debugging context
      failures.forEach(([label, { reason }]) =>
        console.error(`Failed to load ${label}:`, reason)
      )

      const failedLabels = failures.map(([label]) => label)

      if (failedLabels.length === labeled.length) {
        // Every endpoint failed — treat as full error
        setErrors(failedLabels.map((l) => `Failed to load ${l}`))
        setStatus('error')
      } else if (failedLabels.length > 0) {
        // Some endpoints failed — partial success
        setErrors(failedLabels.map((l) => `Could not load ${l}`))
        setStatus('partial')
      } else {
        // All succeeded
        setStatus('success')
      }
    })
  }

  const resetAll = () => {
    setConditions([])
    setConfig({ groups: [], fields: [] } as MatchFormConfig)
    setCriteria([])
    setStudies([])
    setImportantQuestionsConfig({ groups: [] })
    setErrors([])
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
    errors,
    importantQuestionsConfig,
  }
}
