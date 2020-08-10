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
  defaultValues: MatchFormValues
  values: MatchFormValues
  onChange(value: MatchFormValues): void
}

const MatchForm = ({
  config,
  defaultValues,
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
    if (timeout !== undefined) clearTimeout(timeout)

    if (formik.dirty) {
      timeout = setTimeout(() => {
        onChange({ ...formik.values })
      }, 1000)
    }

    return () => {
      if (timeout !== undefined) clearTimeout(timeout)
    }
  }, [formik.values]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (triggerReset) {
      formik.setValues(defaultValues)
      setTriggerReset(false)
    }
  }, [triggerReset]) // eslint-disable-line react-hooks/exhaustive-deps

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
                    hideField = showIf.value !== formik.values[field.id]
                    break
                  }

              return hideField ? undefined : (
                <div className="m-4" key={id}>
                  <Field
                    config={{ ...fieldConfig, name: String(id) }}
                    value={formik.values[id]}
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
