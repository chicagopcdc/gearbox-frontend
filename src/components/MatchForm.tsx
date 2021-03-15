import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import DropdownSection from './DropdownSection'
import Button from './Inputs/Button'
import Field from './Inputs/Field'
import { clearShowIfField, getDefaultValues, getIsFieldShowing } from '../utils'
import { MatchFormValues, MatchFormConfig } from '../model'

export type MatchFormProps = {
  config: MatchFormConfig
  userInput: MatchFormValues
  updateUserInput(values: MatchFormValues): void
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>
}

function MatchForm({
  config,
  userInput,
  updateUserInput,
  setIsUpdating,
}: MatchFormProps) {
  const defaultValues = getDefaultValues(config)
  const formik = useFormik({
    initialValues: { ...defaultValues },
    onSubmit() {},
  })

  useEffect(() => {
    formik.setValues({ ...userInput })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined
    if (timeout !== undefined) clearTimeout(timeout)

    setIsUpdating(true)
    timeout = setTimeout(() => {
      const newValues = { ...formik.values }
      updateUserInput(clearShowIfField(config, defaultValues, newValues))
      setIsUpdating(false)
    }, 1000)

    return () => {
      if (timeout !== undefined) clearTimeout(timeout)
    }
  }, [formik.values]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form onReset={formik.handleReset}>
      {config.groups.map((group, i) => (
        <DropdownSection
          key={group.id}
          name={group.name || 'General'}
          isCollapsedAtStart={i !== 0}
        >
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
