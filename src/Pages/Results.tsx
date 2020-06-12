import React from 'react'
import Box from '../Components/Box'
import SubmittedInfo from '../Components/SubmittedInfo'
import TrialCard, { Trial } from '../Components/TrialCard'

type ResultsData = {
  information: {
    priorTreatmentTherapies: { [key: string]: boolean }
    organFunction: { [key: string]: number }
    prevChemo: string[]
    prevRad: string[]
    biomarkers: string[]
  }
  results: Trial[]
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
        <div className="flex flex-wrap justify-center">
          {results.map((trial) => (
            <TrialCard data={trial}></TrialCard>
          ))}
        </div>
      </Box>
    </>
  )
}

export default Results
