import React from 'react'
import Box from './Box'
import Checkbox from './Inputs/Checkbox'
import TextField from './Inputs/TextField'
import Textarea from './Inputs/Textarea'

const labels: {
  treatments: { [key: string]: string }
  organFunction: { [key: string]: string }
} = {
  treatments: {
    prevChemoFlag: 'previous chemotherapy',
    prevRadFlag: 'previous radiation therapy',
    prevAtra: 'all-trans retinoid acid (ATRA)',
    prevHydroxyurea: 'hydroxyurea',
    prevSteroids: 'corticosteriods',
    prevItCyt: 'IT cytarabine',
    prevOther: 'other antileukemic therapy',
  },
  organFunction: {
    lvEf: 'Left Ventricular Ejection Fraction (%)',
    secrumCr: 'Baseline serum creatinine (mg/dL)',
    astRecent: 'Most recent AST (U/L)',
    altRecent: 'Most recent ALT (U/L)',
  },
}

const allBiomarkers = [
  'MECOM(3q26.2)',
  't(6;9)(p23;q34.1)(DEK-NUP214)',
  'Monosomy 7',
  'Monosomy 5/5q-[ERG1(5q31) deleted]',
  'KMT2A(MLL)(11q23.3)',
  'NUP98(11p15.5)',
  '12p abnormalities (ETV6)',
  'ETS FUS-ERG Fusion',
  'FLT3/ITD+ with alleic ratio > 0.1%',
  'CBFA2T3-GLIS2',
  'RAM phenotype',
  'KAT6A(8p11.21) Fusion',
  'Non-KMT2A MLLT10 Fusions',
]

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
              <Checkbox
                label={labels.treatments[key]}
                checked={treatments[key]}
              />
            </div>
          ))}
        </div>

        <div className="flex-1 m-4">
          <h2 className="font-bold">Organ Function</h2>
          {Object.keys(organFunction).map((key) => (
            <div className="m-4">
              <TextField
                label={labels.organFunction[key]}
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
