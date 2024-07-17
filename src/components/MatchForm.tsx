import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import DropdownSection from './DropdownSection'
import FieldWrapper from './FieldWrapper'
import Field from './Inputs/Field'
import { clearShowIfField, getDefaultValues, getIsFieldShowing } from '../utils'
// import importantQuestionConfig from '../ImportantQuestionConfig.json'
import type {
  MatchFormValues,
  MatchFormConfig,
  ImportantQuestionConfig,
} from '../model'

export type MatchFormProps = {
  config: MatchFormConfig
  matchInput: MatchFormValues
  isFilterActive: boolean
  updateMatchInput(values: MatchFormValues): void
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>
  importantQuestionsConfig: ImportantQuestionConfig
}

function MatchForm({
  config,
  matchInput,
  isFilterActive,
  updateMatchInput,
  setIsUpdating,
  importantQuestionsConfig,
}: MatchFormProps) {
  const [values, setValues] = useState(getDefaultValues(config))
  useEffect(() => setValues({ ...matchInput }), [matchInput])

  const formEl = useRef<HTMLFormElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>()
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValues = {
      ...values,
      [e.target.name]:
        e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }
    setValues(newValues)

    if (timeoutRef.current !== undefined) clearTimeout(timeoutRef.current)

    if (formEl?.current?.reportValidity()) {
      setIsUpdating(true)
      timeoutRef.current = setTimeout(() => {
        updateMatchInput(clearShowIfField(config, newValues))
        setIsUpdating(false)
        clearTimeout(timeoutRef.current)
      }, 1000)
    } else setIsUpdating(false)
  }

  // Separate important fields from the rest
  const importantFields = config.fields.filter((field) =>
    importantQuestionsConfig.groups.some(
      (importantGroup) => importantGroup.name === field.name
    )
  )

  const otherFields = config.fields.filter(
    (field) =>
      !importantQuestionsConfig.groups.some(
        (importantGroup) => importantGroup.name === field.name
      )
  )

  return (
    <form ref={formEl}>
      {/* Render important questions */}
      {importantFields.map(
        ({ id, groupId, relevant, showIf, ...fieldConfig }) => {
          const isFieldShowing =
            (!isFilterActive || relevant) &&
            (showIf === undefined || getIsFieldShowing(showIf, config, values))

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

      {config.groups.map((group, i) => (
        <DropdownSection
          key={group.id}
          backgroundColor="bg-white"
          name={group.name || 'General'}
          isCollapsedAtStart={i !== 0}
        >
          {otherFields.map(
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
                  getIsFieldShowing(showIf, config, values))

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
