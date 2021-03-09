import React, { useState } from 'react'
import MatchForm from './MatchForm'
import MatchResult from './MatchResult'
import {
  EligibilityCriterion,
  MatchCondition,
  MatchFormConfig,
  MatchFormValues,
  Study,
} from '../model'
import { getDefaultValues, getMatchDetails, getMatchGroups } from '../utils'

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
  const [isUpdating, setIsUpdating] = useState(false)

  const defaultValues = getDefaultValues(config)
  const matchDetails = getMatchDetails(criteria, conditions, config, userInput)
  const matchGroups = getMatchGroups(matchDetails)
  const isMatchDataReady =
    config.fields !== undefined && Object.keys(userInput).length > 0

  return isMatchDataReady ? (
    <div className="md:flex">
      <div className="md:w-1/2 p-4 lg:px-8">
        <h1 className="uppercase text-primary font-bold">
          Patient Information
        </h1>
        <MatchForm
          {...{
            config,
            defaultValues,
            userInput,
            updateUserInput,
            setIsUpdating,
          }}
        />
      </div>
      <div
        className={`md:w-1/2 p-4 lg:px-8 ${isUpdating ? 'bg-gray-100' : ''}`}
      >
        <h1 className="uppercase text-primary font-bold">Open Trials</h1>
        <MatchResult {...{ matchDetails, matchGroups, studies }} />
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  )
}

export default HomeMatchingPage
