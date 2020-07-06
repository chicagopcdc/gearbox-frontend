import React from 'react'
import Box from '../Components/Box'
import PatientInfo from '../Components/PatientInfo'
import MatchedTrials from '../Components/MatchedTrials'
import { Trial } from '../types'

type ResultsProps = {
  data: {
    information: {
      priorTreatmentTherapies: { [key: string]: boolean }
      organFunction: { [key: string]: number }
      prevChemo: string[]
      prevRad: string[]
      biomarkers: string[]
    }
    matchResult: {
      isLoaded: boolean
      isError: boolean
      trials: Trial[]
    }
  }
}

const Results = ({ data: { information, matchResult } }: ResultsProps) => (
  <div className="md:flex">
    <Box name="Summary of Submitted Patient Information">
      <PatientInfo data={information} />
    </Box>

    <MatchedTrials
      data={matchResult.trials}
      className={`md:flex-grow ${matchResult.isLoaded ? '' : 'bg-gray-200'}`}
    />
  </div>
)

export default Results
