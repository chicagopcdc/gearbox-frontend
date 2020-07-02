import React from 'react'
import Checkbox from './Inputs/Checkbox'
import TextField from './Inputs/TextField'
import Textarea from './Inputs/Textarea'

import { labels } from '../config'

const styles = {
  group: 'flex-1 m-4',
  groupName: 'font-bold',
  field: 'my-4',
}

type PatientInfoProps = {
  data: {
    priorTreatmentTherapies: { [key: string]: boolean }
    organFunction: { [key: string]: number }
    prevChemo: string[]
    prevRad: string[]
    biomarkers: string[]
  }
}

const PatientInfo = ({
  data: {
    priorTreatmentTherapies,
    organFunction,
    prevChemo,
    prevRad,
    biomarkers,
  },
}: PatientInfoProps) => (
  <>
    <div className={styles.group}>
      <h2 className={styles.groupName}>Prior treatment therapies</h2>
      {Object.keys(priorTreatmentTherapies).map((key) => (
        <div className={styles.field} key={key}>
          <Checkbox
            label={labels[key]}
            checked={priorTreatmentTherapies[key]}
            readOnly
          />
          <div className="mt-2">
            {key === 'prevChemoFlag' && priorTreatmentTherapies[key] && (
              <Textarea value={prevChemo.join('\n') || 'N/A'} readOnly />
            )}
            {key === 'prevRadFlag' && priorTreatmentTherapies[key] && (
              <Textarea value={prevRad.join('\n') || 'N/A'} readOnly />
            )}
          </div>
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
            min={0}
            max={999}
            readOnly
          />
        </div>
      ))}
    </div>

    <div className={styles.group}>
      <h2 className={styles.groupName}>Biomarkers</h2>
      <Textarea value={biomarkers.join('\n')} readOnly />
    </div>
  </>
)

export default PatientInfo
