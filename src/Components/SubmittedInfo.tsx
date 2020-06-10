import React from 'react'
import Box from './Box'
import Checkbox from './Inputs/Checkbox'
import TextField from './Inputs/TextField'
import Textarea from './Inputs/Textarea'

import { biomarkers as allBiomarkers, labels } from '../config'

type SubmittedInfoProps = {
  data: {
    treatments: { [key: string]: boolean }
    organFunction: { [key: string]: number }
    priorChemotherapy: string[]
    priorRadiation: string[]
    biomarkers: string[]
  }
}

const SubmittedInfo = ({ data }: SubmittedInfoProps) => {
  const {
    treatments,
    organFunction,
    priorChemotherapy,
    priorRadiation,
    biomarkers,
  } = data

  return (
    <Box name="Summary of Submitted Patient Information">
      <div className="flex flex-wrap justify-around">
        <div className="flex-1 m-4">
          <h2 className="font-bold">Prior treatment therapies</h2>
          {Object.keys(treatments).map((key) => (
            <div className="m-4">
              <Checkbox label={labels[key]} checked={treatments[key]} />
            </div>
          ))}
        </div>

        <div className="flex-1 m-4">
          <h2 className="font-bold">Organ Function</h2>
          {Object.keys(organFunction).map((key) => (
            <div className="m-4">
              <TextField
                label={labels[key]}
                value={organFunction[key]}
                type="number"
                numberAttrs={{ min: 0, max: 999 }}
                readonly
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-around">
        <div className="flex-1 m-4">
          <h2 className="font-bold">Prior chemotherapy</h2>
          <Textarea value={priorChemotherapy.join('\n')} readonly />
        </div>

        <div className="flex-1 m-4">
          <h2 className="font-bold">Prior radiation therapy</h2>
          <Textarea value={priorRadiation.join('\n')} readonly />
        </div>
      </div>

      <div className="m-4">
        <h2 className="font-bold">Biomarkers</h2>
        {allBiomarkers.map((marker) => (
          <div className="m-4">
            <Checkbox label={marker} checked={biomarkers.includes(marker)} />
          </div>
        ))}
      </div>
    </Box>
  )
}

export default SubmittedInfo
