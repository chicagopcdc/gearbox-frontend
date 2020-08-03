import React, { useEffect, useState, Fragment } from 'react'
import { useFormik } from 'formik'
import Box from './Box'
import Button from './Inputs/Button'

import { initialMatchFormValues, matchFormConfig } from '../config'
import { MatchFormValues } from '../model'
import Field from './Inputs/Field'

const styles = {
  groupName: 'font-bold',
  field: 'my-4',
}

type MatchFormProps = {
  values: MatchFormValues
  onChange(value: MatchFormValues): void
}

const MatchForm = ({ values, onChange }: MatchFormProps) => {
  const [triggerReset, setTriggerReset] = useState(false)
  const formik = useFormik({
    initialValues: { ...values },
    onSubmit() {},
    onReset() {
      setTriggerReset(true)
    },
  })

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined
    if (onChange) {
      if (timeout !== undefined) clearTimeout(timeout)

      if (triggerReset) {
        formik.setValues(initialMatchFormValues)
        setTriggerReset(false)
      } else {
        timeout = setTimeout(() => {
          const values = { ...formik.values }
          if (!values.drugAllergiesFlag) values.drugAllergies = []
          if (!values.prevChemoFlag) values.prevChemo = []
          if (!values.prevRadFlag) values.prevRad = []
          onChange(values)
        }, 1000)
      }
    }
    return () => {
      if (timeout !== undefined) clearTimeout(timeout)
    }
  }, [onChange, formik, triggerReset])

  return (
    <Box name="Patient Information" innerClassName="px-8">
      <form onReset={formik.handleReset}>
        {matchFormConfig.groups.map((group) => (
          <Fragment key={group.id}>
            {group.name && <h2 className={styles.groupName}>{group.name}</h2>}

            {matchFormConfig.inputs.map((input) => {
              if (input.groupId !== group.id) return undefined

              const { defaultValue, showIf, groupId, ...fieldConfig } = input
              const hideField =
                showIf && showIf.value !== formik.values[showIf.name]

              return hideField ? undefined : (
                <div style={{ margin: '1rem' }} key={fieldConfig.name}>
                  <Field
                    config={fieldConfig}
                    value={formik.values[fieldConfig.name]}
                    onChange={formik.handleChange}
                  />
                </div>
              )
            })}
          </Fragment>
        ))}

        <div className="flex flex-wrap justify-center mt-8">
          <Button type="reset">Reset</Button>
        </div>
      </form>
    </Box>
  )
}

export default MatchForm
