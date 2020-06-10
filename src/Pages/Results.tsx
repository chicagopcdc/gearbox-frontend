import React from 'react'
import Box from '../Components/Box'
import SubmittedInfo from '../Components/SubmittedInfo'
import TrialTable from '../Components/TrialTable'

type ResultsData = {
  information: {
    priorTreatmentTherapies: { [key: string]: boolean }
    organFunction: { [key: string]: number }
    prevChemo: string[]
    prevRad: string[]
    biomarkers: string[]
  }
  results: any[]
}

type ResultsProps = {
  data: ResultsData
}

const Results = ({ data }: ResultsProps) => {
  const { information, results } = data
  return (
    <>
      <SubmittedInfo data={information} />

      <Box name="Results">
        <TrialTable data={results} />
      </Box>
    </>
  )
}

export default Results
