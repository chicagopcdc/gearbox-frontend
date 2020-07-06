import React from 'react'
import Box from '../components/Box'
import TrialCard from '../components/TrialCard'
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
