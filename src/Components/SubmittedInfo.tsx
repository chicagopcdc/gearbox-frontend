import React from 'react'
import Checkbox from './Inputs/Checkbox'
import TextField from './Inputs/TextField'
import Textarea from './Inputs/Textarea'

import { biomarkers as allBiomarkers, labels } from '../config'

const styles = {
  group: 'flex-1 m-4',
  groupName: 'font-bold',
  field: 'my-4',
}

type SubmittedInfoProps = {
  data: {
    priorTreatmentTherapies: { [key: string]: boolean }
    organFunction: { [key: string]: number }
    prevChemo: string[]
    prevRad: string[]
    biomarkers: string[]
  }
}

const SubmittedInfo = ({ data }: SubmittedInfoProps) => {
  const {
    priorTreatmentTherapies,
    organFunction,
    prevChemo,
    prevRad,
    biomarkers,
  } = data

  return (
    <>
      <div className="md:flex md:flex-wrap justify-around">
        <div className={styles.group}>
          <h2 className={styles.groupName}>Prior treatment therapies</h2>
          {Object.keys(priorTreatmentTherapies).map((key) => (
            <div className={styles.field} key={key}>
              <Checkbox
                label={labels[key]}
                checked={priorTreatmentTherapies[key]}
                readonly
              />
            </div>
          ))}
        </div>

        <div className={styles.group}>
          <h2 className={styles.groupName}>Organ Function</h2>
          {Object.keys(organFunction).map((key) => (
            <div className={styles.field} key={key}>
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

      <div className="md:flex md:flex-wrap justify-around">
        <div className={styles.group}>
          <h2 className={styles.groupName}>Prior chemotherapy</h2>
          <Textarea value={prevChemo.join('\n')} readonly />
        </div>

        <div className={styles.group}>
          <h2 className={styles.groupName}>Prior radiation therapy</h2>
          <Textarea value={prevRad.join('\n')} readonly />
        </div>
      </div>

      <div className={styles.group}>
        <h2 className={styles.groupName}>Biomarkers</h2>
        {allBiomarkers.map((marker) => (
          <div className={styles.field} key={marker}>
            <Checkbox
              label={marker}
              checked={biomarkers.includes(marker)}
              readonly
            />
          </div>
        ))}
      </div>
    </>
  )
}

export default SubmittedInfo
