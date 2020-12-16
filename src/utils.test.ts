import {
  EligibilityCriterion,
  MatchCondition,
  MatchFormValues,
  MatchFormConfig,
} from './model'
import { getMatchIds, getMatchDetails } from './utils'

const criteria: EligibilityCriterion[] = [
  { id: 0, fieldId: 0, fieldValue: true },
  { id: 1, fieldId: 1, fieldValue: false },
  { id: 2, fieldId: 1, fieldValue: true },
  { id: 3, fieldId: 2, fieldValue: true },
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
const testHelper = (values: MatchFormValues) =>
  getMatchIds(getMatchDetails(criteria, conditions, config, values))

test('getMatchIds for simple AND algorithm', () => {
  const values: MatchFormValues = {
    0: true,
    1: false,
  }
  expect(testHelper(values)).toEqual([0, 1])
})

test('getMatchIds for simple OR algorithm', () => {
  const values: MatchFormValues = {
    0: false,
    1: true,
  }
  expect(testHelper(values)).toEqual([1])
})

test('getMatchIds for nested algorithm', () => {
  const values: MatchFormValues = {
    0: true,
    2: true,
  }
  expect(testHelper(values)).toEqual([1, 2])
})
