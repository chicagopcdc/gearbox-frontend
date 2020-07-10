import React from 'react'
import Box from './Box'
import TrialCard from './TrialCard'
import { Trial } from '../model'

type OpenTrialsProps = {
  className?: string
  matchIds: string[]
  trials: Trial[]
}

const OpenTrials = ({ className, matchIds, trials }: OpenTrialsProps) => {
  const matched = trials.filter(({ id }) => matchIds.includes(id))
  const unmatched = trials.filter(({ id }) => !matchIds.includes(id))

  return (
    <Box name="Open Trials" outerClassName={className}>
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
    </Box>
  )
}

export default OpenTrials
