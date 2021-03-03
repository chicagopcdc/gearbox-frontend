import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import DropdownSection from './DropdownSection'
import Button from './Inputs/Button'
import Field from './Inputs/Field'
import { getIsFieldShowing } from '../utils'
import { MatchFormValues, MatchFormConfig } from '../model'

export type MatchFormProps = {
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
  const formik = useFormik({
    initialValues: { ...defaultValues },
    onSubmit() {},
  })

  useEffect(() => {
    formik.setValues({ ...values })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined
    if (timeout !== undefined) clearTimeout(timeout)

    signalChange()
    timeout = setTimeout(() => {
      onChange({ ...formik.values })
    }, 1000)

    return () => {
      if (timeout !== undefined) clearTimeout(timeout)
    }
  }, [formik.values]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form onReset={formik.handleReset}>
      {config.groups.map((group) => (
        <DropdownSection key={group.id} name={group.name || 'General'}>
          {config.fields.map(
            ({ id, groupId, defaultValue, showIf, ...fieldConfig }) => {
              if (groupId !== group.id) return undefined

              let isFieldShowing = true
              if (showIf !== undefined)
                isFieldShowing = getIsFieldShowing(
                  showIf,
                  config.fields,
                  formik.values
                )

              return (
                isFieldShowing && (
                  <div className="my-4" key={id}>
                    <Field
                      config={{ ...fieldConfig, name: String(id) }}
                      value={formik.values[id]}
                      onChange={formik.handleChange}
                    />
                  </div>
                )
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
