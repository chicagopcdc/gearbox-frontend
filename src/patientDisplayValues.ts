import type {
  MatchFormFieldConfig,
  MatchFormFieldOption,
  MatchFormValues,
} from './model'

function getOptionValue(value: unknown): unknown {
  if (typeof value === 'object' && value !== null && 'value' in value)
    return (value as { value: unknown }).value

  return value
}

function optionValuesEqual(left: unknown, right: unknown): boolean {
  if (left === right) return true
  if (
    left === null ||
    left === undefined ||
    right === null ||
    right === undefined
  )
    return false

  return String(left) === String(right)
}

export function getPatientDisplayValue(
  value: unknown,
  options?: MatchFormFieldOption[]
): unknown {
  if (Array.isArray(value))
    return value.map((item) => getPatientDisplayValue(item, options))

  if (!options?.length) return value

  const optionValue = getOptionValue(value)
  const matchingOption = options.find((option) =>
    optionValuesEqual(option.value, optionValue)
  )

  if (matchingOption) return matchingOption.label

  if (typeof value === 'object' && value !== null && 'label' in value)
    return (value as { label: unknown }).label

  return value
}

export function getPatientDisplayValuesByFieldName(
  fields: MatchFormFieldConfig[],
  values: MatchFormValues
): Record<string, unknown> {
  return Object.fromEntries(
    fields.flatMap((field) => {
      const displayValue = getPatientDisplayValue(
        values[field.id],
        field.options
      )
      const names = [field.name, field.label].filter(
        (name): name is string => typeof name === 'string' && name !== ''
      )

      return names.map((name) => [name, displayValue])
    })
  )
}
