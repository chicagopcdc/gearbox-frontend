import React from 'react'
import Checkbox from './Inputs/Checkbox'
import TextField from './Inputs/TextField'
import Textarea from './Inputs/Textarea'

import { labels } from '../config'
import { MatchFormValues } from '../types'

const styles = {
  group: 'flex-1 m-4',
  groupName: 'font-bold',
  field: 'my-4',
}

const PatientInfo = ({ data }: { data: MatchFormValues }) => (
  <>
    <div className={styles.group}>
      <h2 className={styles.groupName}>Prior treatment therapies</h2>
      {[
        'prevChemoFlag',
        'prevRadFlag',
        'prevAtra',
        'prevHydroxyurea',
        'prevSteroids',
        'prevItCyt',
        'prevOther',
      ].map((key) => (
        <div className={styles.field} key={key}>
          <Checkbox label={labels[key]} checked={(data as any)[key]} readOnly />
          <div className="mt-2">
            {key === 'prevChemoFlag' && data[key] && (
              <Textarea value={data.prevChemo.join('\n') || 'N/A'} readOnly />
            )}
            {key === 'prevRadFlag' && data[key] && (
              <Textarea value={data.prevRad.join('\n') || 'N/A'} readOnly />
            )}
          </div>
        </div>
      ))}
    </div>

    <div className={styles.group}>
      <h2 className={styles.groupName}>Organ Function</h2>
      {['lvEf', 'secrumCr', 'astRecent', 'altRecent'].map((key) => (
        <div className={styles.field} key={key}>
          <TextField
            label={labels[key]}
            value={(data as any)[key]}
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
      <Textarea value={data.biomarkers.join('\n')} readOnly />
    </div>
  </>
)

export default PatientInfo
