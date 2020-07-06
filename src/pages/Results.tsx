import React from 'react'
import Box from '../components/Box'
import PatientInfo from '../components/PatientInfo'
import MatchedTrials from '../components/MatchedTrials'
import { MatchFormValues, MatchResult } from '../model'

type ResultsProps = {
  data: {
    matchFormValues: MatchFormValues
    matchResult: MatchResult
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
