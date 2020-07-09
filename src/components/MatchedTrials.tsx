import React from 'react'
import Box from './Box'
import TrialCard from './TrialCard'
import { Trial } from '../model'

type MatchedTrialsProps = {
  className?: string
  matchIds: string[]
  trials: Trial[]
}

const MatchedTrials = ({ className, matchIds, trials }: MatchedTrialsProps) => (
  <Box name="Matched Trials" outerClassName={className}>
    <h2 className="font-bold text-center">Matched</h2>
    {trials
      .filter(({ id }) => matchIds.includes(id))
      .map((trial, i) => (
        <TrialCard data={trial} key={i} />
      ))}
    <br />
    <h2 className="font-bold text-center">Unmatched</h2>
    {trials
      .filter(({ id }) => !matchIds.includes(id))
      .map((trial, i) => (
        <TrialCard data={trial} key={i} />
      ))}
  </Box>
)

export default MatchedTrials
