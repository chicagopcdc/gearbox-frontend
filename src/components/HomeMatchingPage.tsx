import React, { useState } from 'react'
import { MatchDetails, MatchFormConfig, MatchFormValues, Study } from '../model'
import MatchForm from './MatchForm'
import MatchResult from './MatchResult'

export type HomeMatchingPageProps = {
  config: MatchFormConfig
  defaultValues: MatchFormValues
  userInput: MatchFormValues
  matchDetails: MatchDetails
  matchIds: number[]
  studies: Study[]
  updateUserInput(values: MatchFormValues): void
}

function HomeMatchingPage({
  config,
  defaultValues,
  userInput,
  matchDetails,
  matchIds,
  studies,
  updateUserInput,
}: HomeMatchingPageProps) {
  const [isChanging, setIsChanging] = useState(false)
  const signalChange = () => setIsChanging(true)
  const onChange = (newFormValues: MatchFormValues) => {
    updateUserInput(newFormValues)
    setIsChanging(false)
  }

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
