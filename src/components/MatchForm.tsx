import React, { useEffect, useState, Fragment } from 'react'
import { useFormik } from 'formik'
import Button from './Inputs/Button'
import Field from './Inputs/Field'
import { MatchFormValues, MatchFormConfig } from '../model'

const styles = {
  groupName: 'font-bold',
  field: 'my-4',
}

type MatchFormProps = {
  config: MatchFormConfig
  initialValues: MatchFormValues
  values: MatchFormValues
  onChange(value: MatchFormValues): void
}

const MatchForm = ({
  config,
  initialValues,
  values,
  onChange,
}: MatchFormProps) => {
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
        formik.setValues(initialValues)
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
  }, [initialValues, onChange, formik, triggerReset])

  return (
    <form onReset={formik.handleReset}>
      {config.groups.map((group) => (
        <Fragment key={group.id}>
          {group.name && <h2 className={styles.groupName}>{group.name}</h2>}

          {config.fields.map(
            ({ id, groupId, defaultValue, showIf, ...fieldConfig }) => {
              if (groupId !== group.id) return undefined

              let hideField = false
              if (showIf !== undefined)
                for (const field of config.fields)
                  if (showIf.id === field.id) {
                    hideField = showIf.value !== formik.values[field.name]
                    break
                  }

              return hideField ? undefined : (
                <div className="m-4" key={fieldConfig.name}>
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
