import React from 'react'
import Box from '../Components/Box'
import TrialCard from '../Components/TrialCard'
import { Trial } from '../types'

const Trials = ({ data }: { data?: Trial[] }) => (
  <Box
    name="Complete List of Trials"
    innerClassName="flex flex-wrap justify-center"
  >
    {(data || []).map((trial, i) => (
      <TrialCard data={trial} key={i}></TrialCard>
    ))}
  </Box>
)

export default Trials
