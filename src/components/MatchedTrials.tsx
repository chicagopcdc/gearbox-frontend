import React from 'react'
import Box from './Box'
import TrialCard from './TrialCard'
import { Trial } from '../model'

type MatchedTrialsProps = {
  className?: string
  data: Trial[]
}

const MatchedTrials = ({ className, data }: MatchedTrialsProps) => (
  <Box name="Matched Trials" outerClassName={className}>
    {data.length > 0
      ? data.map((trial, i) => <TrialCard data={trial} key={i} />)
      : 'No matches'}
  </Box>
)

export default MatchedTrials
