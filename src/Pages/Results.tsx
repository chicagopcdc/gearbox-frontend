import React from 'react'
import Box from '../Components/Box'
import SubmittedInfo from '../Components/SubmittedInfo'
import TrialTable from '../Components/TrialTable'

const localData = {
  information: {
    treatments: {
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
    priorChemotherapy: ['foo', 'bar', 'baz'],
    priorRadiation: [''],
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
    treatments: { [key: string]: boolean }
    organFunction: { [key: string]: number }
    priorChemotherapy: string[]
    priorRadiation: string[]
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
