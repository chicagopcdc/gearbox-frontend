import React from 'react'
import Box from '../Components/Box'
import PatientInfo from '../Components/PatientInfo'
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
      <Box name="Summary of Submitted Patient Information">
        <PatientInfo data={information} />
      </Box>

      <Box name="Results">
        <div className="flex flex-wrap justify-center">
          {results.map((trial, i) => (
            <TrialCard data={trial} key={i}></TrialCard>
          ))}
        </div>
      </Box>
    </>
  )
}

export default Results
