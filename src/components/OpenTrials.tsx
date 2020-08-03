import React from 'react'
import TrialCard from './TrialCard'
import { Trial } from '../model'

type OpenTrialsProps = {
  matchIds: string[]
  trials: Trial[]
}

const OpenTrials = ({ matchIds, trials }: OpenTrialsProps) => {
  const matched = trials.filter(({ id }) => matchIds.includes(id))
  const unmatched = trials.filter(({ id }) => !matchIds.includes(id))

  return (
    <>
      {matched.length > 0 && (
        <>
          <h2 className="font-bold text-center">Matched</h2>
          {matched.map((trial, i) => (
            <TrialCard data={trial} key={i} />
          ))}
          <br />
        </>
      )}
      {unmatched.length > 0 && (
        <>
          <h2 className="font-bold text-center">Unmatched</h2>
          {unmatched.map((trial, i) => (
            <TrialCard data={trial} key={i} />
          ))}
        </>
      )}
    </>
  )
}

export default OpenTrials
