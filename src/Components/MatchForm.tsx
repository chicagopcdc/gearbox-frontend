import React from 'react'
import { useFormik } from 'formik'
import Box from './Box'
import Button from './Inputs/Button'
import Checkbox from './Inputs/Checkbox'
import MultiSelect from './Inputs/MultiSelect'
import Select from './Inputs/Select'
import TextField from './Inputs/TextField'

import { labels } from '../config'

const styles = {
  group: 'flex-1 m-4',
  groupName: 'font-bold',
  field: 'my-4',
}

const FormInputs = ({ formik: { handleChange, values } }: any) => (
  <Box name="Patient Information">
    <div className="m-4">
      <div className={styles.field}>
        <TextField
          label={labels.age}
          name="age"
          type="number"
          onChange={handleChange}
          value={values.age}
          min={0}
        />
      </div>

      <div className={styles.field}>
        <Select
          label={labels.initDiag}
          name="initDiag"
          options={['foo', 'bar', 'baz']}
          placeholder="Select"
          onChange={handleChange}
          value={values.initDiag}
        />
      </div>

      <div className={styles.field}>
        <Checkbox
          label={labels.cnsInvolvement}
          name="cnsInvolvement"
          onChange={handleChange}
          checked={values.cnsInvolvement}
        />
      </div>

      <div className={styles.field}>
        <Checkbox
          label={labels.aiDisease}
          name="aiDisease"
          onChange={handleChange}
          checked={values.aiDisease}
        />
      </div>

      <div className={`${styles.field} md:flex md:w-1/2`}>
        <div className="flex-shrink-0">
          <Checkbox
            label={labels.drugAllergiesFlag}
            name="drugAllergiesFlag"
            onChange={handleChange}
            checked={values.drugAllergiesFlag}
          />
        </div>

        <div
          className={
            values.drugAllergiesFlag ? 'mt-4 md:mt-0 md:mx-4 w-full' : 'hidden'
          }
        >
          <MultiSelect
            name="drugAllergies"
            options={['foo', 'bar', 'baz']}
            placeholder="Specify all drug allergies"
            onChange={handleChange}
            values={values.drugAllergies}
          />
        </div>
      </div>
    </div>

    <div className="md:flex md:flex-wrap justify-between">
      <div className={styles.group}>
        <h2 className={styles.groupName}>Prior treatment therapies</h2>

        <div className={styles.field}>
          <Checkbox
            label={labels.prevChemoFlag}
            name="priorTreatmentTherapies.prevChemoFlag"
            onChange={handleChange}
            checked={values.priorTreatmentTherapies.prevChemoFlag}
          />
        </div>

        <div className={styles.field}>
          <Checkbox
            label={labels.prevRadFlag}
            name="priorTreatmentTherapies.prevRadFlag"
            onChange={handleChange}
            checked={values.priorTreatmentTherapies.prevRadFlag}
          />
        </div>

        <div className={styles.field}>
          <Checkbox
            label={labels.prevAtra}
            name="priorTreatmentTherapies.prevAtra"
            onChange={handleChange}
            checked={values.priorTreatmentTherapies.prevAtra}
          />
        </div>

        <div className={styles.field}>
          <Checkbox
            label={labels.prevHydroxyurea}
            name="priorTreatmentTherapies.prevHydroxyurea"
            onChange={handleChange}
            checked={values.priorTreatmentTherapies.prevHydroxyurea}
          />
        </div>

        <div className={styles.field}>
          <Checkbox
            label={labels.prevSteroids}
            name="priorTreatmentTherapies.prevSteroids"
            onChange={handleChange}
            checked={values.priorTreatmentTherapies.prevSteroids}
          />
        </div>

        <div className={styles.field}>
          <Checkbox
            label={labels.prevItCyt}
            name="priorTreatmentTherapies.prevItCyt"
            onChange={handleChange}
            checked={values.priorTreatmentTherapies.prevItCyt}
          />
        </div>

        <div className={styles.field}>
          <Checkbox
            label={labels.prevOther}
            name="priorTreatmentTherapies.prevOther"
            onChange={handleChange}
            checked={values.priorTreatmentTherapies.prevOther}
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
            onChange={handleChange}
            value={values.organFunction.lvEf}
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
            onChange={handleChange}
            value={values.organFunction.secrumCr}
          />
        </div>

        <div className={styles.field}>
          <TextField
            label={labels.astRecent}
            name="organFunction.astRecent"
            type="number"
            min={0}
            max={999}
            onChange={handleChange}
            value={values.organFunction.astRecent}
          />
        </div>

        <div className={styles.field}>
          <TextField
            label={labels.altRecent}
            name="organFunction.altRecent"
            type="number"
            min={0}
            max={999}
            onChange={handleChange}
            value={values.organFunction.altRecent}
          />
        </div>
      </div>
    </div>

    <div
      className={
        values.priorTreatmentTherapies.prevChemoFlag ? 'm-4 md:w-1/2' : 'hidden'
      }
    >
      <h2 className={styles.groupName}>Prior chemotherapy</h2>

      <div className={styles.field}>
        <MultiSelect
          name="prevChemo"
          options={['foo', 'bar', 'baz']}
          placeholder="Select all prior chemotherapy agents"
          onChange={handleChange}
          values={values.prevChemo}
        />
      </div>
    </div>
    <div
      className={
        values.priorTreatmentTherapies.prevRadFlag ? 'm-4 md:w-1/2' : 'hidden'
      }
    >
      <h2 className={styles.groupName}>Prior radiation therapy</h2>

      <div className={styles.field}>
        <MultiSelect
          name="prevRad"
          options={['foo', 'bar', 'baz']}
          placeholder="Select all prior radiation modalities"
          onChange={handleChange}
          values={values.prevRad}
        />
      </div>
    </div>
  </Box>
)

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
    <form onSubmit={formik.handleSubmit}>
      <div className="mt-16">
        <FormInputs formik={formik} />

        <div className="text-center">
          <Button type="submit">Submit</Button>
        </div>
      </div>
    </form>
  )
}

export default MatchForm
