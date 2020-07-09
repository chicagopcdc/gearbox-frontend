import React from 'react'
import Box from './Box'
import TrialCard from './TrialCard'
import { Trial } from '../model'

type MatchedTrialsProps = {
  className?: string
  matchIds: string[]
  trials: Trial[]
}

const MatchedTrials = ({ className, matchIds, trials }: MatchedTrialsProps) => {
  const matches = trials.filter(({ id }) => matchIds.includes(id))
  return (
    <Box name="Matched Trials" outerClassName={className}>
      {matches.length > 0
        ? matches.map((trial, i) => <TrialCard data={trial} key={i} />)
        : 'No matches'}
    </Box>
  )
}

export default MatchedTrials
