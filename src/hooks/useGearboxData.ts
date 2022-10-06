import { useState, useEffect } from 'react'
import type {
  EligibilityCriterion,
  MatchCondition,
  MatchFormConfig,
  MatchFormValues,
  Study,
} from '../model'
import {
  mockLoadEligibilityCriteria,
  mockLoadMatchConditions,
  mockLoadMatchFormConfig,
  mockLoadStudies,
} from '../mock/utils'
import { getLatestUserInput, postUserInput } from '../api/userInput'
import type useAuth from './useAuth'

export default function useGearboxData(auth: ReturnType<typeof useAuth>) {
  const [conditions, setConditions] = useState([] as MatchCondition[])
  const [config, setConfig] = useState({} as MatchFormConfig)
  const [criteria, setCriteria] = useState([] as EligibilityCriterion[])
  const [matchInput, setMatchInput] = useState({} as MatchFormValues)
  const [studies, setStudies] = useState([] as Study[])
  const [userInputId, setUserInputId] = useState(
    undefined as number | undefined
  )

  const updateMatchInput = (newMatchInput: MatchFormValues) => {
    if (JSON.stringify(newMatchInput) !== JSON.stringify(matchInput)) {
      setMatchInput(newMatchInput)
      postUserInput(newMatchInput, userInputId).then((latestUserInputId) => {
        if (userInputId === undefined) setUserInputId(latestUserInputId)
      })
    }
  }

  useEffect(() => {
    if (auth.isRegistered) {
      // load data on login
      Promise.all([
        mockLoadMatchConditions(),
        mockLoadMatchFormConfig(),
        mockLoadEligibilityCriteria(),
        mockLoadStudies(),
        getLatestUserInput(),
      ]).then(
        ([
          conditions,
          config,
          criteria,
          studies,
          [latestMatchInput, latestUserInputId],
        ]) => {
          setConditions(conditions)
          setConfig(config)
          setCriteria(criteria)
          setMatchInput(latestMatchInput)
          setStudies(studies)
          setUserInputId(latestUserInputId)
        }
      )
    } else {
      // clear data on logout
      setConditions([])
      setConfig({} as MatchFormConfig)
      setCriteria([])
      setMatchInput({})
      setStudies([])
      setUserInputId(undefined)
    }
  }, [auth.isRegistered])

  return {
    action: {
      updateMatchInput,
    },
    state: {
      conditions,
      config,
      criteria,
      matchInput,
      studies,
    },
  }
}
