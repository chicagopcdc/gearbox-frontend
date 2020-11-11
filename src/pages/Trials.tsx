import React from 'react'
import Box from '../components/Box'
import TrialCard from '../components/TrialCard'
import { Study } from '../model'

const Trials = ({ studies }: { studies?: Study[] }) => (
  <Box name="Complete List of Trials" innerClassName="max-w-md m-auto">
    {(studies || []).map((study, i) => (
      <TrialCard study={study} key={i}></TrialCard>
    ))}
  </Box>
)

export default Trials
