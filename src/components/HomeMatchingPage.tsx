import React, { useState } from 'react'
import { MatchFormConfig, MatchFormValues } from '../model'
import MatchForm from './MatchForm'
import MatchResult, { MatchResultProps } from './MatchResult'

export type HomeMatchingPageProps = {
  updateUserInput(values: MatchFormValues): void
  matchFormProps: {
    config: MatchFormConfig
    defaultValues: MatchFormValues
    userInput: MatchFormValues
  }
  matchResultProps: MatchResultProps
}

function HomeMatchingPage({
  updateUserInput,
  matchFormProps,
  matchResultProps,
}: HomeMatchingPageProps) {
  const [isChanging, setIsChanging] = useState(false)
  const signalChange = () => setIsChanging(true)
  const onChange = (newFormValues: MatchFormValues) => {
    updateUserInput(newFormValues)
    setIsChanging(false)
  }

  const isMatchDataReady =
    matchFormProps.config.fields !== undefined &&
    Object.keys(matchFormProps.userInput).length > 0

  return isMatchDataReady ? (
    <div className="md:flex">
      <div className="md:w-1/2 p-4 lg:px-8">
        <h1 className="uppercase text-primary font-bold">
          Patient Information
        </h1>
        <MatchForm
          {...matchFormProps}
          onChange={onChange}
          signalChange={signalChange}
        />
      </div>
      <div
        className={`md:w-1/2 p-4 lg:px-8 ${isChanging ? 'bg-gray-100' : ''}`}
      >
        <h1 className="uppercase text-primary font-bold">Open Trials</h1>
        <MatchResult {...matchResultProps} />
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  )
}

export default HomeMatchingPage
