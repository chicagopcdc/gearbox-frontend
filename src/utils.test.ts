import {
  EligibilityCriterion,
  MatchCondition,
  MatchFormValues,
  MatchFormConfig,
  MatchFormFieldShowIfCondition,
} from './model'
import { getMatchIds, getMatchDetails, getIsFieldShowing } from './utils'

const criteria: EligibilityCriterion[] = [
  { id: 0, fieldId: 0, fieldValue: true, operator: 'eq' },
  { id: 1, fieldId: 1, fieldValue: false, operator: 'eq' },
  { id: 2, fieldId: 1, fieldValue: true, operator: 'eq' },
  { id: 3, fieldId: 2, fieldValue: 0, operator: 'gt' },
]
const config: MatchFormConfig = {
  groups: [],
  fields: [
    { id: 0, name: 'field 0', groupId: 0, type: '' },
    { id: 1, name: 'field 1', groupId: 0, type: '' },
    { id: 2, name: 'field 2', groupId: 0, type: '' },
  ],
}
const conditions: MatchCondition[] = [
  {
    studyId: 0,
    algorithm: {
      operator: 'AND',
      criteria: [0, 1],
    },
  },
  {
    studyId: 1,
    algorithm: {
      operator: 'OR',
      criteria: [0, 2],
    },
  },
  {
    studyId: 2,
    algorithm: {
      operator: 'AND',
      criteria: [0, { operator: 'OR', criteria: [2, 3] }],
    },
  },
]
const getMatchIdsTestHelper = (values: MatchFormValues) =>
  getMatchIds(getMatchDetails(criteria, conditions, config, values))

test('getMatchIds for simple AND algorithm', () => {
  const values: MatchFormValues = {
    0: true,
    1: false,
  }
  expect(getMatchIdsTestHelper(values)).toEqual([0, 1])
})

test('getMatchIds for simple OR algorithm', () => {
  const values: MatchFormValues = {
    0: false,
    1: true,
  }
  expect(getMatchIdsTestHelper(values)).toEqual([1])
})

test('getMatchIds for nested algorithm', () => {
  const values: MatchFormValues = {
    0: true,
    2: 1,
  }
  expect(getMatchIdsTestHelper(values)).toEqual([1, 2])
})

test('getIsFieldShowing for one criterion (eq)', () => {
  const showIf: MatchFormFieldShowIfCondition = {
    operator: 'OR',
    criteria: [{ id: 0, operator: 'eq', value: true }],
  }
  const values: MatchFormValues = { 0: true, 1: undefined, 2: undefined }

  expect(getIsFieldShowing(showIf, config.fields, values)).toEqual(true)
})

test('getIsFieldShowing for one criterion (gt)', () => {
  const showIf: MatchFormFieldShowIfCondition = {
    operator: 'OR',
    criteria: [{ id: 2, operator: 'gt', value: 1 }],
  }
  const values: MatchFormValues = { 0: true, 1: undefined, 2: 2 }

  expect(getIsFieldShowing(showIf, config.fields, values)).toEqual(true)
})

test('getIsFieldShowing for multiple criteria (OR)', () => {
  const showIf: MatchFormFieldShowIfCondition = {
    operator: 'OR',
    criteria: [
      { id: 0, operator: 'eq', value: true },
      { id: 1, operator: 'eq', value: true },
      { id: 2, operator: 'gt', value: 1 },
    ],
  }
  const values1: MatchFormValues = { 0: true }
  expect(getIsFieldShowing(showIf, config.fields, values1)).toEqual(true)

  const values2: MatchFormValues = { 0: false, 1: true }
  expect(getIsFieldShowing(showIf, config.fields, values2)).toEqual(true)

  const values3: MatchFormValues = { 0: false, 1: false, 2: 2 }
  expect(getIsFieldShowing(showIf, config.fields, values3)).toEqual(true)

  const values4: MatchFormValues = { 0: false, 1: false, 2: 1 }
  expect(getIsFieldShowing(showIf, config.fields, values4)).toEqual(false)
})

test('getIsFieldShowing for multiple criteria (AND)', () => {
  const showIf: MatchFormFieldShowIfCondition = {
    operator: 'AND',
    criteria: [
      { id: 0, operator: 'eq', value: true },
      { id: 1, operator: 'eq', value: true },
      { id: 2, operator: 'gt', value: 1 },
    ],
  }
  const values1: MatchFormValues = { 0: true }
  expect(getIsFieldShowing(showIf, config.fields, values1)).toEqual(false)

  const values2: MatchFormValues = { 0: true, 1: false }
  expect(getIsFieldShowing(showIf, config.fields, values2)).toEqual(false)

  const values3: MatchFormValues = { 0: true, 1: true, 2: 2 }
  expect(getIsFieldShowing(showIf, config.fields, values3)).toEqual(true)

  const values4: MatchFormValues = { 0: true, 1: true, 2: 1 }
  expect(getIsFieldShowing(showIf, config.fields, values4)).toEqual(false)
})
