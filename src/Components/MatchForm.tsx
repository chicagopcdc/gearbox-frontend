import React from 'react'
import { useFormik } from 'formik'
import Box from './Box'
import Button from './Inputs/Button'
import Checkbox from './Inputs/Checkbox'
import MultiSelect from './Inputs/MultiSelect'
import Select from './Inputs/Select'
import TextField from './Inputs/TextField'

import { biomarkers, labels } from '../config'

const styles = {
  group: 'flex-1 m-4',
  groupName: 'font-bold',
  field: 'my-4',
}

const initialValues = {
  age: 0,
  initDiag: '',
  cnsInvolvement: false,
  aiDisease: false,
  drugAllergiesFlag: false,
  drugAllergies: [],
  priorTreatmentTherapies: {
    prevChemoFlag: false,
    prevRadFlag: false,
    prevAtra: false,
    prevHydroxyurea: false,
    prevSteroids: false,
    prevItCyt: false,
    prevOther: false,
  },
  organFunction: {
    lvEf: 0,
    secrumCr: 0,
    astRecent: 0,
    altRecent: 0,
  },
  prevChemo: [],
  prevRad: [],
  biomarkers: [],
}

const MatchForm = ({ onSubmit }: { onSubmit(value: any): void }) => {
  const formik = useFormik({
    initialValues: { ...initialValues },
    onSubmit: (values) => {
      if (!values.drugAllergiesFlag) values.drugAllergies = []
      if (!values.priorTreatmentTherapies.prevChemoFlag) values.prevChemo = []
      if (!values.priorTreatmentTherapies.prevRadFlag) values.prevRad = []
      onSubmit(values)
    },
  })
  return (
    <Box name="Patient Information">
      <form onSubmit={formik.handleSubmit}>
        <div className="m-4">
          <div className={styles.field}>
            <TextField
              label={labels.age}
              name="age"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.age}
              min={0}
            />
          </div>

          <div className={styles.field}>
            <Select
              label={labels.initDiag}
              name="initDiag"
              options={['foo', 'bar', 'baz']}
              placeholder="Select"
              onChange={formik.handleChange}
              value={formik.values.initDiag}
            />
          </div>

          <div className={styles.field}>
            <Checkbox
              label={labels.cnsInvolvement}
              name="cnsInvolvement"
              onChange={formik.handleChange}
              checked={formik.values.cnsInvolvement}
            />
          </div>

          <div className={styles.field}>
            <Checkbox
              label={labels.aiDisease}
              name="aiDisease"
              onChange={formik.handleChange}
              checked={formik.values.aiDisease}
            />
          </div>

          <div className="flex-shrink-0">
            <Checkbox
              label={labels.drugAllergiesFlag}
              name="drugAllergiesFlag"
              onChange={formik.handleChange}
              checked={formik.values.drugAllergiesFlag}
            />
          </div>

          <div
            className={
              formik.values.drugAllergiesFlag
                ? 'mt-4 w-full md:w-1/2'
                : 'hidden'
            }
          >
            <MultiSelect
              name="drugAllergies"
              options={['foo', 'bar', 'baz']}
              placeholder="Specify all drug allergies"
              onChange={formik.handleChange}
              values={formik.values.drugAllergies}
            />
          </div>
        </div>

        <div className="md:flex md:flex-wrap justify-between">
          <div className={styles.group}>
            <h2 className={styles.groupName}>Prior treatment therapies</h2>

            <div className={styles.field}>
              <Checkbox
                label={labels.prevChemoFlag}
                name="priorTreatmentTherapies.prevChemoFlag"
                onChange={formik.handleChange}
                checked={formik.values.priorTreatmentTherapies.prevChemoFlag}
              />
            </div>

            <div
              className={
                formik.values.priorTreatmentTherapies.prevChemoFlag
                  ? styles.field
                  : 'hidden'
              }
            >
              <MultiSelect
                name="prevChemo"
                options={['foo', 'bar', 'baz']}
                placeholder="Select all prior chemotherapy agents"
                onChange={formik.handleChange}
                values={formik.values.prevChemo}
              />
            </div>

            <div className={styles.field}>
              <Checkbox
                label={labels.prevRadFlag}
                name="priorTreatmentTherapies.prevRadFlag"
                onChange={formik.handleChange}
                checked={formik.values.priorTreatmentTherapies.prevRadFlag}
              />
            </div>

            <div
              className={
                formik.values.priorTreatmentTherapies.prevRadFlag
                  ? styles.field
                  : 'hidden'
              }
            >
              <MultiSelect
                name="prevRad"
                options={['foo', 'bar', 'baz']}
                placeholder="Select all prior radiation modalities"
                onChange={formik.handleChange}
                values={formik.values.prevRad}
              />
            </div>

            <div className={styles.field}>
              <Checkbox
                label={labels.prevAtra}
                name="priorTreatmentTherapies.prevAtra"
                onChange={formik.handleChange}
                checked={formik.values.priorTreatmentTherapies.prevAtra}
              />
            </div>

            <div className={styles.field}>
              <Checkbox
                label={labels.prevHydroxyurea}
                name="priorTreatmentTherapies.prevHydroxyurea"
                onChange={formik.handleChange}
                checked={formik.values.priorTreatmentTherapies.prevHydroxyurea}
              />
            </div>

            <div className={styles.field}>
              <Checkbox
                label={labels.prevSteroids}
                name="priorTreatmentTherapies.prevSteroids"
                onChange={formik.handleChange}
                checked={formik.values.priorTreatmentTherapies.prevSteroids}
              />
            </div>

            <div className={styles.field}>
              <Checkbox
                label={labels.prevItCyt}
                name="priorTreatmentTherapies.prevItCyt"
                onChange={formik.handleChange}
                checked={formik.values.priorTreatmentTherapies.prevItCyt}
              />
            </div>

            <div className={styles.field}>
              <Checkbox
                label={labels.prevOther}
                name="priorTreatmentTherapies.prevOther"
                onChange={formik.handleChange}
                checked={formik.values.priorTreatmentTherapies.prevOther}
              />
            </div>
          </div>
          <div className={styles.group}>
            <h2 className={styles.groupName}>Organ Function</h2>

            <div className={styles.field}>
              <TextField
                label={labels.lvEf}
                name="organFunction.lvEf"
                type="number"
                min={0}
                max={100}
                step={0.1}
                onChange={formik.handleChange}
                value={formik.values.organFunction.lvEf}
              />
            </div>

            <div className={styles.field}>
              <TextField
                label={labels.secrumCr}
                name="organFunction.secrumCr"
                type="number"
                min={0}
                max={999}
                step={0.1}
                onChange={formik.handleChange}
                value={formik.values.organFunction.secrumCr}
              />
            </div>

            <div className={styles.field}>
              <TextField
                label={labels.astRecent}
                name="organFunction.astRecent"
                type="number"
                min={0}
                max={999}
                onChange={formik.handleChange}
                value={formik.values.organFunction.astRecent}
              />
            </div>

            <div className={styles.field}>
              <TextField
                label={labels.altRecent}
                name="organFunction.altRecent"
                type="number"
                min={0}
                max={999}
                onChange={formik.handleChange}
                value={formik.values.organFunction.altRecent}
              />
            </div>
          </div>
        </div>

        <div className={styles.group}>
          <h2 className={styles.groupName}>Biomarkers</h2>

          <div className="mt-4 w-full md:w-1/2">
            <MultiSelect
              name="biomarkers"
              options={biomarkers}
              placeholder="Select all biomarkers"
              onChange={formik.handleChange}
              values={formik.values.biomarkers}
            />
          </div>
        </div>

        <div className="text-center mt-8">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Box>
  )
}

export default MatchForm
