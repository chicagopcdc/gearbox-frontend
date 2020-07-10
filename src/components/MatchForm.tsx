import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import Box from './Box'
import Button from './Inputs/Button'
import MultiSelect from './Inputs/MultiSelect'
import Radio from './Inputs/Radio'
import Select from './Inputs/Select'
import TextField from './Inputs/TextField'

import { biomarkers, initialMatchFormValues, labels } from '../config'
import { MatchFormValues } from '../model'

const styles = {
  groupName: 'font-bold',
  field: 'my-4',
}

type MatchFormProps = {
  values: MatchFormValues
  onChange(value: MatchFormValues): void
}

const MatchForm = ({ values, onChange }: MatchFormProps) => {
  const formik = useFormik({
    initialValues: { ...values },
    onSubmit() {},
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
      <form>
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
          <Radio
            label={labels.cnsInvolvement}
            name="cnsInvolvement"
            options={['true', 'false', 'unknown']}
            onChange={formik.handleChange}
            value={formik.values.cnsInvolvement}
          />
        </div>

        <div className={styles.field}>
          <Radio
            label={labels.aiDisease}
            name="aiDisease"
            options={['true', 'false', 'unknown']}
            onChange={formik.handleChange}
            value={formik.values.aiDisease}
          />
        </div>

        <div className={styles.field}>
          <Radio
            label={labels.drugAllergiesFlag}
            name="drugAllergiesFlag"
            options={['true', 'false', 'unknown']}
            onChange={formik.handleChange}
            value={formik.values.drugAllergiesFlag}
          />
        </div>

        <div
          className={
            formik.values.drugAllergiesFlag === 'true' ? styles.field : 'hidden'
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

        <h2 className={styles.groupName}>Prior treatment therapies</h2>

        <div className={styles.field}>
          <Radio
            label={labels.prevChemoFlag}
            name="prevChemoFlag"
            options={['true', 'false', 'unknown']}
            onChange={formik.handleChange}
            value={formik.values.prevChemoFlag}
          />
        </div>

        <div
          className={
            formik.values.prevChemoFlag === 'true' ? styles.field : 'hidden'
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
          <Radio
            label={labels.prevRadFlag}
            name="prevRadFlag"
            options={['true', 'false', 'unknown']}
            onChange={formik.handleChange}
            value={formik.values.prevRadFlag}
          />
        </div>

        <div
          className={
            formik.values.prevRadFlag === 'true' ? styles.field : 'hidden'
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
          <Radio
            label={labels.prevAtra}
            name="prevAtra"
            options={['true', 'false', 'unknown']}
            onChange={formik.handleChange}
            value={formik.values.prevAtra}
          />
        </div>

        <div className={styles.field}>
          <Radio
            label={labels.prevHydroxyurea}
            name="prevHydroxyurea"
            options={['true', 'false', 'unknown']}
            onChange={formik.handleChange}
            value={formik.values.prevHydroxyurea}
          />
        </div>

        <div className={styles.field}>
          <Radio
            label={labels.prevSteroids}
            name="prevSteroids"
            options={['true', 'false', 'unknown']}
            onChange={formik.handleChange}
            value={formik.values.prevSteroids}
          />
        </div>

        <div className={styles.field}>
          <Radio
            label={labels.prevItCyt}
            name="prevItCyt"
            options={['true', 'false', 'unknown']}
            onChange={formik.handleChange}
            value={formik.values.prevItCyt}
          />
        </div>

        <div className={styles.field}>
          <Radio
            label={labels.prevOther}
            name="prevOther"
            options={['true', 'false', 'unknown']}
            onChange={formik.handleChange}
            value={formik.values.prevOther}
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
