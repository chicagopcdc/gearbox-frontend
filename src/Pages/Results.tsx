import React from 'react'
import Box from '../Components/Box'
import SubmittedInfo from '../Components/SubmittedInfo'
import TrialTable from '../Components/TrialTable'

const localData = {
  information: {
    priorTreatmentTherapies: {
      prevChemoFlag: true,
      prevRadFlag: true,
      prevAtra: false,
      prevHydroxyurea: false,
      prevSteroids: true,
      prevItCyt: false,
      prevOther: false,
    },
    organFunction: {
      lvEf: 57,
      secrumCr: 0.9,
      astRecent: 23,
      altRecent: 17,
    },
    prevChemo: ['foo', 'bar', 'baz'],
    prevRad: [''],
    biomarkers: ['MECOM(3q26.2)', 'ETS FUS-ERG Fusion'],
  },
  results: [
    {
      title: '',
      group: '',
      location: '',
      link: { name: '', url: '' },
      contact: '',
    },
  ],
}

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
  data?: ResultsData
}

const Results = ({ data }: ResultsProps) => {
  const { information, results } = data || (localData as ResultsData)
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
