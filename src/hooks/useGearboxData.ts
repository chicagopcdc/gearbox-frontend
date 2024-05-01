import { useState, useEffect } from 'react'
import type {
  ApiStatus,
  EligibilityCriterion,
  MatchCondition,
  MatchFormConfig,
  Study,
} from '../model'
import { getEligibilityCriteria } from '../api/eligibilityCriteria'
import { getMatchConditions } from '../api/matchConditions'
import { getMatchFormConfig } from '../api/matchFormConfig'
import { getStudies } from '../api/studies'
import type useAuth from './useAuth'

export default function useGearboxData(auth: ReturnType<typeof useAuth>) {
  const [conditions, setConditions] = useState([] as MatchCondition[])
  const [config, setConfig] = useState({
    groups: [],
    fields: [],
  } as MatchFormConfig)
  const [criteria, setCriteria] = useState([] as EligibilityCriterion[])
  const [studies, setStudies] = useState([] as Study[])
  const [status, setStatus] = useState<ApiStatus>('not started')

  const fetchAll = () => {
    setStatus('sending')
    Promise.all([
      getMatchConditions(),
      getMatchFormConfig(),
      getEligibilityCriteria(),
      getStudies(),
    ])
      .then(([conditions, config, criteria, studies]) => {
        setConditions(conditions)
        setConfig(config)
        setCriteria(criteria)
        setStudies(studies)
        setStatus('not started')
      })
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
  }
  // const updateMatchInput = (newMatchInput: MatchFormValues) => {
  //   if (JSON.stringify(newMatchInput) !== JSON.stringify(matchInput)) {
  //     setMatchInput(newMatchInput)
  //     postUserInput(newMatchInput, userInputId).then((latestUserInputId) => {
  //       if (userInputId === undefined) setUserInputId(latestUserInputId)
  //     })
  //   }
  // }

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
  }
}
