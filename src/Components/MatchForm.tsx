import React from 'react'
import { useFormik } from 'formik'
import Box from './Box'
import Button from './Inputs/Button'
import Checkbox from './Inputs/Checkbox'
import MultiSelect from './Inputs/MultiSelect'
import Select from './Inputs/Select'
import TextField from './Inputs/TextField'

import { labels } from '../config'

import foundationMedicineLogo from '../assets/foundation-medicine-logo.jpg'
import hematologicsLogo from '../assets/hematologics-logo.png'

const styles = {
  group: 'flex-1 m-4',
  groupName: 'font-bold',
  field: 'm-4',
}

const SectionInformation = ({ formik: { handleChange, values } }: any) => (
  <Box name="Patient Information">
    <div className={styles.field}>
      <TextField
        label={labels.cogId}
        name="patientInformation.cogId"
        onChange={handleChange}
        value={values.patientInformation.cogId}
      />
    </div>

    <div className={styles.field}>
      <TextField
        label={labels.age}
        name="patientInformation.age"
        type="number"
        onChange={handleChange}
        value={values.patientInformation.age}
        numberAttrs={{ min: 0 }}
      />
    </div>

    <div className={styles.field}>
      <Select
        label={labels.initDiag}
        name="patientInformation.initDiag"
        options={['foo', 'bar', 'baz']}
        placeholder="Select"
        onChange={handleChange}
        value={values.patientInformation.initDiag}
      />
    </div>
  </Box>
)

const SectionSubmission = () => (
  <Box name="Biomaker Report Submission">
    <div className="text-center">
      <h2 className={styles.groupName}>Upload Files</h2>
      <img
        className="border border-solid border-black m-auto my-2 w-1/2"
        src={hematologicsLogo}
        alt="Hematologics logo"
      />
      <img
        className="border border-solid border-black m-auto my-2 w-1/2"
        src={foundationMedicineLogo}
        alt="Foundation Medicine logo"
      />
    </div>
  </Box>
)

const SectionDetails = ({ formik: { handleChange, values } }: any) => (
  <Box name="Clinical Details">
    <div className="flex flex-wrap justify-around">
      <div className={styles.field}>
        <Checkbox
          label={labels.cnsInvolvement}
          name="clinicalDetails.cnsInvolvement"
          onChange={handleChange}
          checked={values.clinicalDetails.cnsInvolvement}
        />
      </div>

      <div className={styles.field}>
        <Checkbox
          label={labels.aiDisease}
          name="clinicalDetails.aiDisease"
          onChange={handleChange}
          checked={values.clinicalDetails.aiDisease}
        />
      </div>

      <div className={styles.field + ' flex'}>
        <div>
          <Checkbox
            label={labels.drugAllergiesFlag}
            name="clinicalDetails.drugAllergiesFlag"
            onChange={handleChange}
            checked={values.clinicalDetails.drugAllergiesFlag}
          />
        </div>

        <div className="ml-4">
          <MultiSelect
            name="clinicalDetails.drugAllergies"
            options={['foo', 'bar', 'baz']}
            placeholder="Please specify"
            onChange={handleChange}
            values={values.clinicalDetails.drugAllergies}
          />
        </div>
      </div>
    </div>

    <div className="flex flex-wrap justify-between">
      <div className={styles.group}>
        <h2 className={styles.groupName}>Prior treatment therapies</h2>

        <div className={styles.field}>
          <Checkbox
            label={labels.prevChemoFlag}
            name="clinicalDetails.priorTreatmentTherapies.prevChemoFlag"
            onChange={handleChange}
            checked={
              values.clinicalDetails.priorTreatmentTherapies.prevChemoFlag
            }
          />
        </div>

        <div className={styles.field}>
          <Checkbox
            label={labels.prevRadFlag}
            name="clinicalDetails.priorTreatmentTherapies.prevRadFlag"
            onChange={handleChange}
            checked={values.clinicalDetails.priorTreatmentTherapies.prevRadFlag}
          />
        </div>

        <div className={styles.field}>
          <Checkbox
            label={labels.prevAtra}
            name="clinicalDetails.priorTreatmentTherapies.prevAtra"
            onChange={handleChange}
            checked={values.clinicalDetails.priorTreatmentTherapies.prevAtra}
          />
        </div>

        <div className={styles.field}>
          <Checkbox
            label={labels.prevHydroxyurea}
            name="clinicalDetails.priorTreatmentTherapies.prevHydroxyurea"
            onChange={handleChange}
            checked={
              values.clinicalDetails.priorTreatmentTherapies.prevHydroxyurea
            }
          />
        </div>

        <div className={styles.field}>
          <Checkbox
            label={labels.prevSteroids}
            name="clinicalDetails.priorTreatmentTherapies.prevSteroids"
            onChange={handleChange}
            checked={
              values.clinicalDetails.priorTreatmentTherapies.prevSteroids
            }
          />
        </div>

        <div className={styles.field}>
          <Checkbox
            label={labels.prevItCyt}
            name="clinicalDetails.priorTreatmentTherapies.prevItCyt"
            onChange={handleChange}
            checked={values.clinicalDetails.priorTreatmentTherapies.prevItCyt}
          />
        </div>

        <div className={styles.field}>
          <Checkbox
            label={labels.prevOther}
            name="clinicalDetails.priorTreatmentTherapies.prevOther"
            onChange={handleChange}
            checked={values.clinicalDetails.priorTreatmentTherapies.prevOther}
          />
        </div>
      </div>
      <div className={styles.group}>
        <h2 className={styles.groupName}>Organ Function</h2>

        <div className={styles.field}>
          <TextField
            label={labels.lvEf}
            name="clinicalDetails.organFunction.lvEf"
            type="number"
            numberAttrs={{ min: 0, max: 100, step: 0.1 }}
            onChange={handleChange}
            value={values.clinicalDetails.organFunction.lvEf}
          />
        </div>

        <div className={styles.field}>
          <TextField
            label={labels.secrumCr}
            name="clinicalDetails.organFunction.secrumCr"
            type="number"
            numberAttrs={{ min: 0, max: 999, step: 0.1 }}
            onChange={handleChange}
            value={values.clinicalDetails.organFunction.secrumCr}
          />
        </div>

        <div className={styles.field}>
          <TextField
            label={labels.astRecent}
            name="clinicalDetails.organFunction.astRecent"
            type="number"
            numberAttrs={{ min: 0, max: 999 }}
            onChange={handleChange}
            value={values.clinicalDetails.organFunction.astRecent}
          />
        </div>

        <div className={styles.field}>
          <TextField
            label={labels.altRecent}
            name="clinicalDetails.organFunction.altRecent"
            type="number"
            numberAttrs={{ min: 0, max: 999 }}
            onChange={handleChange}
            value={values.clinicalDetails.organFunction.altRecent}
          />
        </div>
      </div>
    </div>

    <div className="flex flex-wrap justify-between">
      <div className={styles.group}>
        <h2 className={styles.groupName}>Prior chemotherapy</h2>

        <div className={styles.field}>
          <MultiSelect
            label="hello"
            name="clinicalDetails.prevChemo"
            options={['foo', 'bar', 'baz']}
            placeholder="Please select all prior chemotherapy agents"
            onChange={handleChange}
            values={values.clinicalDetails.prevChemo}
          />
        </div>
      </div>
      <div className={styles.group}>
        <h2 className={styles.groupName}>Prior radiation therapy</h2>

        <div className={styles.field}>
          <MultiSelect
            label="hello"
            name="clinicalDetails.prevRad"
            options={['foo', 'bar', 'baz']}
            placeholder="Please select all prior radiation modalities"
            onChange={handleChange}
            values={values.clinicalDetails.prevRad}
          />
        </div>
      </div>
    </div>
  </Box>
)

const initialValues = {
  patientInformation: {
    cogId: '',
    age: 0,
    initDiag: '',
  },
  clinicalDetails: {
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
  },
}

const MatchForm = ({ onSubmit }: { onSubmit(value: any): void }) => {
  const formik = useFormik({
    initialValues: { ...initialValues },
    onSubmit,
  })
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="mt-16">
        <div className="flex flex-wrap">
          <div className="flex-1">
            <SectionInformation formik={formik} />
          </div>
          <div className="flex-1">
            <SectionSubmission />
          </div>
        </div>
        <SectionDetails formik={formik} />

        <div className="text-center">
          <Button type="submit">Submit</Button>
        </div>
      </div>
    </form>
  )
}

export default MatchForm
