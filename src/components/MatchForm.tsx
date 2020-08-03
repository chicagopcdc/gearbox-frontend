import React, { useEffect, useState, Fragment } from 'react'
import { useFormik } from 'formik'
import Button from './Inputs/Button'

import { initialMatchFormValues, matchFormConfig } from '../config'
import { MatchFormFieldConfig, MatchFormValues } from '../model'
import Field from './Inputs/Field'

const styles = {
  groupName: 'font-bold',
  field: 'my-4',
}

const getShowIfName = (fields: MatchFormFieldConfig[], showIfId: number) => {
  let showIfName
  for (const { id, name } of fields) {
    if (showIfId === id) {
      showIfName = name
      break
    }
  }

  return showIfName
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
    <form onReset={formik.handleReset}>
      {matchFormConfig.groups.map((group) => (
        <Fragment key={group.id}>
          {group.name && <h2 className={styles.groupName}>{group.name}</h2>}

          {matchFormConfig.fields.map(
            ({ id, groupId, defaultValue, showIf, ...fieldConfig }) => {
              if (groupId !== group.id) return undefined

              const showIfName =
                showIf && getShowIfName(matchFormConfig.fields, showIf.id)
              const hideField =
                showIf &&
                showIfName &&
                showIf.value !== formik.values[showIfName]

              return hideField ? undefined : (
                <div style={{ margin: '1rem' }} key={fieldConfig.name}>
                  <Field
                    config={fieldConfig}
                    value={formik.values[fieldConfig.name]}
                    onChange={formik.handleChange}
                  />
                </div>
              )
            }
          )}
        </Fragment>
      ))}

      <div className="flex flex-wrap justify-center mt-8">
        <Button type="reset">Reset</Button>
      </div>
    </form>
  )
}

export default MatchForm
