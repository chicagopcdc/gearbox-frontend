import type { MatchFormFieldConfig } from './model'
import {
  getPatientDisplayValue,
  getPatientDisplayValuesByFieldName,
} from './patientDisplayValues'

const options = [
  { value: 1, label: 'First choice' },
  { value: 3, label: 'Third choice' },
]

test('keeps continuous numeric values unchanged', () => {
  expect(getPatientDisplayValue(3)).toBe(3)
})

test('replaces an option ID with its display label', () => {
  expect(getPatientDisplayValue(3, options)).toBe('Third choice')
})

test('replaces multiselect values with their display labels', () => {
  expect(
    getPatientDisplayValue([1, { value: 3, label: 'Stale label' }], options)
  ).toEqual(['First choice', 'Third choice'])
})

test('indexes display values by both field name and label', () => {
  const fields: MatchFormFieldConfig[] = [
    {
      id: 10,
      groupId: 1,
      type: 'select',
      name: 'diagnosis',
      label: 'Current diagnosis',
      options,
    },
    {
      id: 11,
      groupId: 1,
      type: 'number',
      name: 'age',
    },
  ]

  expect(
    getPatientDisplayValuesByFieldName(fields, { 10: 3, 11: 12.5 })
  ).toEqual({
    diagnosis: 'Third choice',
    'Current diagnosis': 'Third choice',
    age: 12.5,
  })
})
