import React from 'react'
import { useFormik } from 'formik'
import Box from './Box'
import Button from './Inputs/Button'
import Checkbox from './Inputs/Checkbox'
import MultiSelect from './Inputs/MultiSelect'
import Select from './Inputs/Select'
import TextField from './Inputs/TextField'

import foundationMedicineLogo from '../assets/foundation-medicine-logo.jpg'
import hematologicsLogo from '../assets/hematologics-logo.png'

const styles = {
  field: 'm-4',
}

const SectionInformation = ({ formik }: { formik: any }) => (
  <Box name="Patient Information">
    <div className={styles.field}>
      <TextField
        label="COG ID Number"
        name="patientInformation.cogId"
        onChange={formik.handleChange}
        value={formik.values.patientInformation.cogId}
      />
    </div>

    <div className={styles.field}>
      <TextField
        label="Patient Age"
        name="patientInformation.age"
        type="number"
        onChange={formik.handleChange}
        value={formik.values.patientInformation.age}
        numberAttrs={{ min: 0 }}
      />
    </div>

    <div className={styles.field}>
      <Select
        label="Initial Disease Diagnosis"
        name="patientInformation.initDiag"
        options={['foo', 'bar', 'baz']}
        placeholder="Select"
        onChange={formik.handleChange}
        value={formik.values.patientInformation.initDiag}
      />
    </div>
  </Box>
)

const SectionSubmission = () => (
  <Box name="Biomaker Report Submission">
    <div className="text-center">
      <h2 className="font-bold">Upload Files</h2>
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

const SectionDetails = ({ formik }: { formik: any }) => (
  <Box name="Clinical Details">
    <div className="flex flex-wrap justify-around">
      <div className={styles.field}>
        <Checkbox
          label="CNS Involvement"
          name="clinicalDetails.cnsInvolvement"
          onChange={formik.handleChange}
          checked={formik.values.clinicalDetails.cnsInvolvement}
        />
      </div>

      <div className={styles.field}>
        <Checkbox
          label="History of Autoimmune Disease"
          name="clinicalDetails.aiDisease"
          onChange={formik.handleChange}
          checked={formik.values.clinicalDetails.aiDisease}
        />
      </div>

      <div className={styles.field + ' flex'}>
        <div>
          <Checkbox
            label="Drug Allergies"
            name="clinicalDetails.drugAllergiesFlag"
            onChange={formik.handleChange}
            checked={formik.values.clinicalDetails.drugAllergiesFlag}
          />
        </div>

        <div className="ml-4">
          <MultiSelect
            name="clinicalDetails.drugAllergies"
            options={['foo', 'bar', 'baz']}
            placeholder="Please specify"
            onChange={formik.handleChange}
            values={formik.values.clinicalDetails.drugAllergies}
          />
        </div>
      </div>
    </div>

    <div className="flex flex-wrap justify-between">
      <div className="flex-1 m-4">
        <h2 className="font-bold">Prior treatment therapies</h2>

        <div className={styles.field}>
          <Checkbox
            label="previous chemotherapy"
            name="clinicalDetails.priorTreatmentTherapies.prevChemoFlag"
            onChange={formik.handleChange}
            checked={
              formik.values.clinicalDetails.priorTreatmentTherapies
                .prevChemoFlag
            }
          />
        </div>

        <div className={styles.field}>
          <Checkbox
            label="previous radiation therapy"
            name="clinicalDetails.priorTreatmentTherapies.prevRadFlag"
            onChange={formik.handleChange}
            checked={
              formik.values.clinicalDetails.priorTreatmentTherapies.prevRadFlag
            }
          />
        </div>

        <div className={styles.field}>
          <Checkbox
            label="all-trans retinoid acid (ATRA)"
            name="clinicalDetails.priorTreatmentTherapies.prevAtra"
            onChange={formik.handleChange}
            checked={
              formik.values.clinicalDetails.priorTreatmentTherapies.prevAtra
            }
          />
        </div>

        <div className={styles.field}>
          <Checkbox
            label="hydroxyurea"
            name="clinicalDetails.priorTreatmentTherapies.prevHydroxyurea"
            onChange={formik.handleChange}
            checked={
              formik.values.clinicalDetails.priorTreatmentTherapies
                .prevHydroxyurea
            }
          />
        </div>

        <div className={styles.field}>
          <Checkbox
            label="corticosteriods"
            name="clinicalDetails.priorTreatmentTherapies.prevSteroids"
            onChange={formik.handleChange}
            checked={
              formik.values.clinicalDetails.priorTreatmentTherapies.prevSteroids
            }
          />
        </div>

        <div className={styles.field}>
          <Checkbox
            label="IT cytarabine"
            name="clinicalDetails.priorTreatmentTherapies.prevItCyt"
            onChange={formik.handleChange}
            checked={
              formik.values.clinicalDetails.priorTreatmentTherapies.prevItCyt
            }
          />
        </div>

        <div className={styles.field}>
          <Checkbox
            label="other antileukemic therapy"
            name="clinicalDetails.priorTreatmentTherapies.prevOther"
            onChange={formik.handleChange}
            checked={
              formik.values.clinicalDetails.priorTreatmentTherapies.prevOther
            }
          />
        </div>
      </div>
      <div className="m-4">
        <h2 className="font-bold">Organ Function</h2>

        <div className={styles.field}>
          <TextField
            label="Left Ventricular Ejection Fraction (%)"
            name="clinicalDetails.organFunction.lvEf"
            type="number"
            numberAttrs={{ min: 0, max: 100, step: 0.1 }}
            onChange={formik.handleChange}
            value={formik.values.clinicalDetails.organFunction.lvEf}
          />
        </div>

        <div className={styles.field}>
          <TextField
            label="Baseline serum creatinine (mg/dL)"
            name="clinicalDetails.organFunction.secrumCr"
            type="number"
            numberAttrs={{ min: 0, max: 999, step: 0.1 }}
            onChange={formik.handleChange}
            value={formik.values.clinicalDetails.organFunction.secrumCr}
          />
        </div>

        <div className={styles.field}>
          <TextField
            label="Most recent AST (U/L)"
            name="clinicalDetails.organFunction.astRecent"
            type="number"
            numberAttrs={{ min: 0, max: 999 }}
            onChange={formik.handleChange}
            value={formik.values.clinicalDetails.organFunction.astRecent}
          />
        </div>

        <div className={styles.field}>
          <TextField
            label="Most recent ALT (U/L)"
            name="clinicalDetails.organFunction.altRecent"
            type="number"
            numberAttrs={{ min: 0, max: 999 }}
            onChange={formik.handleChange}
            value={formik.values.clinicalDetails.organFunction.altRecent}
          />
        </div>
      </div>
    </div>

    <div className="flex flex-wrap justify-between">
      <div className="flex-1 m-4">
        <h2 className="font-bold">Prior chemotherapy</h2>

        <div className={styles.field}>
          <MultiSelect
            label="hello"
            name="clinicalDetails.prevChemo"
            options={['foo', 'bar', 'baz']}
            placeholder="Please select all prior chemotherapy agents"
            onChange={formik.handleChange}
            values={formik.values.clinicalDetails.prevChemo}
          />
        </div>
      </div>
      <div className="flex-1 m-4">
        <h2 className="font-bold">Prior radiation therapy</h2>

        <div className={styles.field}>
          <MultiSelect
            label="hello"
            name="clinicalDetails.prevRad"
            options={['foo', 'bar', 'baz']}
            placeholder="Please select all prior radiation modalities"
            onChange={formik.handleChange}
            values={formik.values.clinicalDetails.prevRad}
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
