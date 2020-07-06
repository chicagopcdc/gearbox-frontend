import React from 'react'
import Box from '../Components/Box'
import PatientInfo from '../Components/PatientInfo'
import MatchedTrials from '../Components/MatchedTrials'
import { Trial, MatchFormValues } from '../types'

type ResultsProps = {
  data: {
    matchFormValues: MatchFormValues
    matchResult: {
      isLoaded: boolean
      isError: boolean
      trials: Trial[]
    }
  }
}

const Results = ({ data: { matchFormValues, matchResult } }: ResultsProps) => (
  <div className="md:flex">
    <Box name="Summary of Submitted Patient Information">
      <PatientInfo data={matchFormValues} />
    </Box>

    <MatchedTrials
      data={matchResult.trials}
      className={`md:flex-grow ${matchResult.isLoaded ? '' : 'bg-gray-200'}`}
    />
  </div>
)

export default Results
