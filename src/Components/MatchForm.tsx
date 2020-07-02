import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import Box from './Box'
import Button from './Inputs/Button'
import Checkbox from './Inputs/Checkbox'
import MultiSelect from './Inputs/MultiSelect'
import Select from './Inputs/Select'
import TextField from './Inputs/TextField'

import { biomarkers, initialMatchFormValues, labels } from '../config'

const styles = {
  groupName: 'font-bold',
  field: 'my-4',
}

type MatchFormProps = {
  values: any
  onChange?(value: any): void
  onSubmit(value: any): void
}

const MatchForm = ({ values, onChange, onSubmit }: MatchFormProps) => {
  const formik = useFormik({
    initialValues: { ...values },
    onSubmit: (values) => {
      if (!values.drugAllergiesFlag) values.drugAllergies = []
      if (!values.prevChemoFlag) values.prevChemo = []
      if (!values.prevRadFlag) values.prevRad = []
      onSubmit(values)
    },
  })

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined
    if (onChange) {
      if (timeout !== undefined) clearTimeout(timeout)

      timeout = setTimeout(() => {
        const values = { ...formik.values }
        if (!values.drugAllergiesFlag) values.drugAllergies = []
        if (!values.prevChemoFlag) values.prevChemo = []
        if (!values.prevRadFlag) values.prevRad = []
        onChange(values)
      }, 1000)
    }
    return () => {
      if (timeout !== undefined) clearTimeout(timeout)
    }
  }, [onChange, formik.values])

  return (
    <Box name="Patient Information" innerClassName="px-8">
      <form onSubmit={formik.handleSubmit}>
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

        <div className={styles.field}>
          <Checkbox
            label={labels.drugAllergiesFlag}
            name="drugAllergiesFlag"
            onChange={formik.handleChange}
            checked={formik.values.drugAllergiesFlag}
          />
        </div>

        <div
          className={formik.values.drugAllergiesFlag ? styles.field : 'hidden'}
        >
          <MultiSelect
            name="drugAllergies"
            options={['foo', 'bar', 'baz']}
            placeholder="Specify all drug allergies"
            onChange={formik.handleChange}
            values={formik.values.drugAllergies}
          />
        </div>

        <h2 className={styles.groupName}>Prior treatment therapies</h2>

        <div className={styles.field}>
          <Checkbox
            label={labels.prevChemoFlag}
            name="prevChemoFlag"
            onChange={formik.handleChange}
            checked={formik.values.prevChemoFlag}
          />
        </div>

        <div className={formik.values.prevChemoFlag ? styles.field : 'hidden'}>
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
            name="prevRadFlag"
            onChange={formik.handleChange}
            checked={formik.values.prevRadFlag}
          />
        </div>

        <div className={formik.values.prevRadFlag ? styles.field : 'hidden'}>
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
            name="prevAtra"
            onChange={formik.handleChange}
            checked={formik.values.prevAtra}
          />
        </div>

        <div className={styles.field}>
          <Checkbox
            label={labels.prevHydroxyurea}
            name="prevHydroxyurea"
            onChange={formik.handleChange}
            checked={formik.values.prevHydroxyurea}
          />
        </div>

        <div className={styles.field}>
          <Checkbox
            label={labels.prevSteroids}
            name="prevSteroids"
            onChange={formik.handleChange}
            checked={formik.values.prevSteroids}
          />
        </div>

        <div className={styles.field}>
          <Checkbox
            label={labels.prevItCyt}
            name="prevItCyt"
            onChange={formik.handleChange}
            checked={formik.values.prevItCyt}
          />
        </div>

        <div className={styles.field}>
          <Checkbox
            label={labels.prevOther}
            name="prevOther"
            onChange={formik.handleChange}
            checked={formik.values.prevOther}
          />
        </div>

        <h2 className={styles.groupName}>Organ Function</h2>

        <div className={styles.field}>
          <TextField
            label={labels.lvEf}
            name="lvEf"
            type="number"
            min={0}
            max={100}
            step={0.1}
            onChange={formik.handleChange}
            value={formik.values.lvEf}
          />
        </div>

        <div className={styles.field}>
          <TextField
            label={labels.secrumCr}
            name="secrumCr"
            type="number"
            min={0}
            max={999}
            step={0.1}
            onChange={formik.handleChange}
            value={formik.values.secrumCr}
          />
        </div>

        <div className={styles.field}>
          <TextField
            label={labels.astRecent}
            name="astRecent"
            type="number"
            min={0}
            max={999}
            onChange={formik.handleChange}
            value={formik.values.astRecent}
          />
        </div>

        <div className={styles.field}>
          <TextField
            label={labels.altRecent}
            name="altRecent"
            type="number"
            min={0}
            max={999}
            onChange={formik.handleChange}
            value={formik.values.altRecent}
          />
        </div>

        <h2 className={styles.groupName}>Biomarkers</h2>

        <div className={styles.field}>
          <MultiSelect
            name="biomarkers"
            options={biomarkers}
            placeholder="Select all biomarkers"
            onChange={formik.handleChange}
            values={formik.values.biomarkers}
          />
        </div>

        <div className="flex flex-wrap justify-center mt-8">
          <Button type="submit">Submit</Button>
          <div className="mx-2"></div>
          <Button
            type="reset"
            onClick={() => formik.setValues(initialMatchFormValues)}
          >
            Reset
          </Button>
        </div>
      </form>
    </Box>
  )
}

export default MatchForm
