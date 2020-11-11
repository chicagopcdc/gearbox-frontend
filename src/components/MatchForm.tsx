import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import DropdownSection from './DropdownSection'
import Button from './Inputs/Button'
import Field from './Inputs/Field'
import { MatchFormValues, MatchFormConfig } from '../model'

type MatchFormProps = {
  config: MatchFormConfig
  defaultValues: MatchFormValues
  values: MatchFormValues
  onChange(value: MatchFormValues): void
  signalChange(): void
}

function MatchForm({
  config,
  defaultValues,
  values,
  onChange,
  signalChange,
}: MatchFormProps) {
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
      signalChange()
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
        <DropdownSection key={group.id} name={group.name || 'General'}>
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
                <div className="my-4" key={id}>
                  <Field
                    config={{ ...fieldConfig, name: String(id) }}
                    value={formik.values[id]}
                    onChange={formik.handleChange}
                  />
                </div>
              )
            }
          )}
        </DropdownSection>
      ))}

      <div className="flex flex-wrap justify-center mt-8">
        <Button type="reset" outline>
          Reset
        </Button>
      </div>
    </form>
  )
}

export default MatchForm
