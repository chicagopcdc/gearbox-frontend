import React, { useState } from 'react'
import {
  EligibilityCriterion,
  MatchCondition,
  MatchFormConfig,
  MatchFormValues,
  Study,
} from '../model'
import { getDefaultValues, getMatchDetails, getMatchIds } from '../utils'
import MatchForm from './MatchForm'
import MatchResult from './MatchResult'

export type HomeMatchingPageProps = {
  conditions: MatchCondition[]
  config: MatchFormConfig
  criteria: EligibilityCriterion[]
  studies: Study[]
  userInput: MatchFormValues
  updateUserInput(values: MatchFormValues): void
}

function HomeMatchingPage({
  conditions,
  config,
  criteria,
  studies,
  userInput,
  updateUserInput,
}: HomeMatchingPageProps) {
  const [isChanging, setIsChanging] = useState(false)
  const signalChange = () => setIsChanging(true)
  const onChange = (newFormValues: MatchFormValues) => {
    updateUserInput(newFormValues)
    setIsChanging(false)
  }

  const defaultValues = getDefaultValues(config)
  const matchDetails = getMatchDetails(criteria, conditions, config, userInput)
  const matchIds = getMatchIds(matchDetails)
  const isMatchDataReady =
    config.fields !== undefined && Object.keys(userInput).length > 0

  return isMatchDataReady ? (
    <div className="md:flex">
      <div className="md:w-1/2 p-4 lg:px-8">
        <h1 className="uppercase text-primary font-bold">
          Patient Information
        </h1>
        <MatchForm
          {...{ config, defaultValues, userInput, onChange, signalChange }}
        />
      </div>
      <div
        className={`md:w-1/2 p-4 lg:px-8 ${isChanging ? 'bg-gray-100' : ''}`}
      >
        <h1 className="uppercase text-primary font-bold">Open Trials</h1>
        <MatchResult {...{ matchDetails, matchIds, studies }} />
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  )
}

export default HomeMatchingPage
