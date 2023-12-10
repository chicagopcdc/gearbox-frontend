import { useState, useEffect } from 'react'
import type {
  ApiStatus,
  EligibilityCriterion,
  MatchCondition,
  MatchFormConfig,
  MatchFormValues,
  Study,
} from '../model'
import { getEligibilityCriteria } from '../api/eligibilityCriteria'
import { getMatchConditions } from '../api/matchConditions'
import { getMatchFormConfig } from '../api/matchFormConfig'
import { getStudies } from '../api/studies'
import { getLatestUserInput, postUserInput } from '../api/userInput'
import type useAuth from './useAuth'

export default function useGearboxData(auth: ReturnType<typeof useAuth>) {
  const [conditions, setConditions] = useState([] as MatchCondition[])
  const [config, setConfig] = useState({
    groups: [],
    fields: [],
  } as MatchFormConfig)
  const [criteria, setCriteria] = useState([] as EligibilityCriterion[])
  const [matchInput, setMatchInput] = useState({} as MatchFormValues)
  const [studies, setStudies] = useState([] as Study[])
  const [userInputId, setUserInputId] = useState(
    undefined as number | undefined
  )
  const [status, setStatus] = useState<ApiStatus>('not started')

  const fetchAll = () => {
    setStatus('sending')
    Promise.all([
      getMatchConditions(),
      getMatchFormConfig(),
      getEligibilityCriteria(),
      getStudies(),
      getLatestUserInput(),
    ])
      .then(([conditions, config, criteria, studies, latestUserInput]) => {
        setConditions(conditions)
        setConfig(config)
        setCriteria(criteria)
        setMatchInput(latestUserInput.values)
        setStudies(studies)
        setUserInputId(latestUserInput.id)
        setStatus('not started')
      })
      .catch(() => {
        setStatus('error')
      })
  }
  const resetAll = () => {
    setConditions([])
    setConfig({ groups: [], fields: [] } as MatchFormConfig)
    setCriteria([])
    setMatchInput({})
    setStudies([])
    setUserInputId(undefined)
  }
  const updateMatchInput = (newMatchInput: MatchFormValues) => {
    if (JSON.stringify(newMatchInput) !== JSON.stringify(matchInput)) {
      setMatchInput(newMatchInput)
      postUserInput(newMatchInput, userInputId).then((latestUserInputId) => {
        if (userInputId === undefined) setUserInputId(latestUserInputId)
      })
    }
  }

  useEffect(() => {
    if (auth.isRegistered) fetchAll() // load data on login
    else resetAll() // clear data on logout
  }, [auth.isRegistered])

  return {
    action: {
      fetchAll,
      updateMatchInput,
    },
    state: {
      conditions,
      config,
      criteria,
      matchInput,
      studies,
    },
    status,
  }
}
