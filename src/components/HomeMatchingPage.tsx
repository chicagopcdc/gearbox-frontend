import React from 'react'
import MatchForm, { MatchFormProps } from './MatchForm'
import MatchResult, { MatchResultProps } from './MatchResult'

export type HomeMatchingPageProps = {
  isChanging: boolean
  matchFormProps: MatchFormProps
  matchResultProps: MatchResultProps
}

function HomeMatchingPage({
  isChanging,
  matchFormProps,
  matchResultProps,
}: HomeMatchingPageProps) {
  return (
    <div className="md:flex">
      <div className="md:w-1/2 p-4 md:pr-8 lg:pr-12">
        <h1 className="uppercase text-primary font-bold">
          Patient Information
        </h1>
        <MatchForm {...matchFormProps} />
      </div>
      <div
        className={`md:w-1/2 p-4 md:pl-8 lg:pl-12 ${
          isChanging ? 'bg-gray-100' : ''
        }`}
      >
        <h1 className="uppercase text-primary font-bold">Open Trials</h1>
        <MatchResult {...matchResultProps} />
      </div>
    </div>
  )
}

export default HomeMatchingPage
