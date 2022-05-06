import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import DropdownSection from './DropdownSection'
import FieldWrapper from './FieldWrapper'
import Field from './Inputs/Field'
import { clearShowIfField, getDefaultValues, getIsFieldShowing } from '../utils'
import type { MatchFormValues, MatchFormConfig } from '../model'

export type MatchFormProps = {
  config: MatchFormConfig
  matchInput: MatchFormValues
  isFilterActive: boolean
  updateMatchInput(values: MatchFormValues): void
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>
}

function MatchForm({
  config,
  matchInput,
  isFilterActive,
  updateMatchInput,
  setIsUpdating,
}: MatchFormProps) {
  const defaultValues = getDefaultValues(config)
  const [values, setValues] = useState(defaultValues)
  useEffect(() => setValues({ ...matchInput }), [matchInput])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setValues((values) => ({ ...values, [e.target.name]: value }))
  }

  const formEl = useRef<HTMLFormElement>(null)
  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined
    if (timeout !== undefined) clearTimeout(timeout)

    if (formEl?.current?.reportValidity()) {
      setIsUpdating(true)
      timeout = setTimeout(() => {
        const newValues = { ...values }
        updateMatchInput(clearShowIfField(config, defaultValues, newValues))
        setIsUpdating(false)
      }, 1000)
    } else setIsUpdating(false)

    return () => {
      if (timeout !== undefined) clearTimeout(timeout)
    }
  }, [values]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form ref={formEl}>
      {config.groups.map((group, i) => (
        <DropdownSection
          key={group.id}
          backgroundColor="bg-white"
          name={group.name || 'General'}
          isCollapsedAtStart={i !== 0}
        >
          {config.fields.map(
            ({
              id,
              groupId,
              defaultValue, // eslint-disable-line @typescript-eslint/no-unused-vars
              relevant,
              showIf,
              ...fieldConfig
            }) => {
              if (groupId !== group.id) return null

              const isFieldShowing =
                (!isFilterActive || relevant) &&
                (showIf === undefined ||
                  getIsFieldShowing(showIf, config.fields, values))

              return (
                <FieldWrapper key={id} isShowing={isFieldShowing}>
                  <Field
                    config={{
                      ...fieldConfig,
                      name: String(id),
                      disabled: !relevant,
                    }}
                    value={values[id]}
                    onChange={handleChange}
                  />
                </FieldWrapper>
              )
            }
          )}
        </DropdownSection>
      ))}
    </form>
  )
}

export default MatchForm
