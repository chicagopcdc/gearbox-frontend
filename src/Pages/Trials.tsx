import React from 'react'
import Box from '../Components/Box'
import TrialCard, { Trial } from '../Components/TrialCard'

const Trials = ({ data }: { data?: Trial[] }) => (
  <Box name="Complete List of Trials">
    <div className="flex flex-wrap justify-center">
      {(data || []).map((trial) => (
        <TrialCard data={trial}></TrialCard>
      ))}
    </div>
  </Box>
)

export default Trials
