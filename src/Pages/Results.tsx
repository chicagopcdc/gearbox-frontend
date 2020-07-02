import React from 'react'
import Box from '../Components/Box'
import PatientInfo from '../Components/PatientInfo'
import TrialCard, { Trial } from '../Components/TrialCard'

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
  <>
    <Box name="Summary of Submitted Patient Information">
      <PatientInfo data={information} />
    </Box>

    <Box name="Results">
      <div className="flex flex-wrap justify-center">
        {matchResult.isLoaded
          ? matchResult.trials.map((trial, i) => (
              <TrialCard data={trial} key={i}></TrialCard>
            ))
          : 'Loading matched trials...'}
      </div>
    </Box>
  </>
)

export default Results
