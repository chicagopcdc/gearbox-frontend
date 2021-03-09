import {
  EligibilityCriterion,
  MatchCondition,
  MatchFormValues,
  MatchFormConfig,
  MatchFormFieldShowIfCondition,
} from './model'
import {
  getMatchDetails,
  getMatchGroups,
  getIsFieldShowing,
  getFieldOptionLabelMap,
} from './utils'

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

describe('getMatchGroups', () => {
  const getMatchGroupsTestHelper = (values: MatchFormValues) =>
    getMatchGroups(getMatchDetails(criteria, conditions, config, values))

  test('for simple AND algorithm', () => {
    const values: MatchFormValues = {
      0: true,
      1: false,
    }
    expect(getMatchGroupsTestHelper(values)).toEqual({
      matched: [0, 1],
      undetermined: [],
      unmatched: [2],
    })
  })

  test('for simple OR algorithm', () => {
    const values: MatchFormValues = {
      0: false,
      1: true,
    }
    expect(getMatchGroupsTestHelper(values)).toEqual({
      matched: [1],
      undetermined: [],
      unmatched: [0, 2],
    })
  })

  test('for nested algorithm', () => {
    const values: MatchFormValues = {
      0: true,
      2: 1,
    }
    expect(getMatchGroupsTestHelper(values)).toEqual({
      matched: [1, 2],
      undetermined: [0],
      unmatched: [],
    })
  })
})

describe('getIsFieldShowing', () => {
  test('for one criterion (eq)', () => {
    const showIf: MatchFormFieldShowIfCondition = {
      operator: 'OR',
      criteria: [{ id: 0, operator: 'eq', value: true }],
    }
    const values: MatchFormValues = { 0: true, 1: undefined, 2: undefined }

    expect(getIsFieldShowing(showIf, config.fields, values)).toEqual(true)
  })

  test('for one criterion (gt)', () => {
    const showIf: MatchFormFieldShowIfCondition = {
      operator: 'OR',
      criteria: [{ id: 2, operator: 'gt', value: 1 }],
    }
    const values: MatchFormValues = { 0: true, 1: undefined, 2: 2 }

    expect(getIsFieldShowing(showIf, config.fields, values)).toEqual(true)
  })

  test('for multiple criteria (OR)', () => {
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

  test('for multiple criteria (AND)', () => {
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
})

describe('getFieldOptionLabelMap', () => {
  test('from form config', () => {
    const config: MatchFormConfig = {
      groups: [],
      fields: [
        {
          id: 0,
          groupId: 0,
          type: 'select',
          name: 'foobar',
          options: [
            { value: 0, label: 'foo' },
            { value: 1, label: 'bar' },
          ],
        },
        {
          id: 1,
          groupId: 0,
          type: 'number',
          name: 'baz',
        },
        {
          id: 2,
          groupId: 0,
          type: 'radio',
          name: 'baz',
          options: [{ value: 0, label: 'baz' }],
        },
      ],
    }
    expect(getFieldOptionLabelMap(config.fields)).toEqual({
      0: { 0: 'foo', 1: 'bar' },
      2: { 0: 'baz' },
    })
  })
})
