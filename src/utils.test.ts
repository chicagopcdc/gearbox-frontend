import type {
  EligibilityCriterion,
  MatchAlgorithm,
  MatchCondition,
  MatchFormValues,
  MatchFormConfig,
  MatchFormFieldShowIfCondition,
  MatchInfoAlgorithm,
  MatchInfo,
  Study,
} from './model'
import {
  addMatchStatus,
  getIsFieldShowing,
  getFieldOptionLabelMap,
  getUniqueCritIdsInAlgorithm,
  markRelevantMatchFields,
  getQueryBuilderConfig,
  getQueryBuilderValue,
  queryBuilderValueToAlgorithm,
  getShowIfDetails,
} from './utils'
import { MatchFormFieldConfig } from './model'
import {
  Fields,
  JsonGroup,
  Utils as QbUtils,
} from '@react-awesome-query-builder/ui'

const studies: Study[] = [
  {
    id: 0,
    name: 'Study 0',
    code: 'S0000',
    sites: [],
    links: [
      {
        name: 'ClinicalTrials.gov',
        href: 'https://clinicaltrials.gov/ct2/show/NCT04726241',
      },
    ],
    description: 'Study 0',
    follow_up_info: '',
  },
  {
    id: 1,
    name: 'Study 1',
    follow_up_info: '',
    code: 'S0001',
    sites: [],
    links: [
      {
        name: 'ClinicalTrials.gov',
        href: 'https://clinicaltrials.gov/ct2/show/NCT04726241',
      },
    ],
    description: 'Study 1',
  },
  {
    id: 2,
    name: 'Study 2',
    follow_up_info: '',
    code: 'S0002',
    sites: [],
    links: [
      {
        name: 'ClinicalTrials.gov',
        href: 'https://clinicaltrials.gov/ct2/show/NCT04726241',
      },
    ],
    description: 'Study 2',
  },
]
const criteria: EligibilityCriterion[] = [
  { id: 0, fieldId: 0, fieldValue: [1, 2], operator: 'in' },
  { id: 1, fieldId: 1, fieldValue: false, operator: 'eq' },
  { id: 2, fieldId: 1, fieldValue: true, operator: 'eq' },
  { id: 3, fieldId: 2, fieldValue: 0, operator: 'gt' },
  { id: 4, fieldId: 3, fieldValue: 0, operator: 'eq' },
]
const config: MatchFormConfig = {
  groups: [],
  fields: [
    {
      id: 0,
      name: 'field 0',
      groupId: 0,
      type: 'select',
      options: [
        { label: 'foo', value: 0 },
        { label: 'bar', value: 1 },
        { label: 'baz', value: 2 },
      ],
    },
    { id: 1, name: 'field 1', groupId: 0, type: 'text' },
    { id: 2, name: 'field 2', groupId: 0, type: 'text' },
    {
      id: 3,
      name: 'field 3',
      groupId: 0,
      type: 'select',
      options: [
        { label: 'Yes', value: 0 },
        { label: 'No', value: 1 },
        { label: 'Not sure', value: 2 },
      ],
    },
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
  {
    studyId: 3,
    algorithm: {
      operator: 'AND',
      criteria: [4],
    },
  },
]

describe('addMatchStatus', () => {
  function createDummyMatchInfo(isMatched: boolean | undefined): MatchInfo {
    return {
      fieldName: '',
      fieldValue: '',
      isMatched,
      operator: 'eq',
    }
  }

  const matchUndefined = createDummyMatchInfo(undefined)
  const matchTrue = createDummyMatchInfo(true)
  const matchFalse = createDummyMatchInfo(false)

  test('for a single match info, "AND" operator', () => {
    const a0: MatchInfoAlgorithm = {
      operator: 'AND',
      criteria: [matchUndefined],
    }
    expect(addMatchStatus(a0)).toEqual({ ...a0, isMatched: undefined })

    const a1: MatchInfoAlgorithm = {
      operator: 'AND',
      criteria: [matchTrue],
    }
    expect(addMatchStatus(a1)).toEqual({ ...a1, isMatched: true })

    const a2: MatchInfoAlgorithm = {
      operator: 'AND',
      criteria: [matchFalse],
    }
    expect(addMatchStatus(a2)).toEqual({ ...a2, isMatched: false })
  })

  test('for a single match info, "OR" operator', () => {
    const a0: MatchInfoAlgorithm = {
      operator: 'OR',
      criteria: [matchUndefined],
    }
    expect(addMatchStatus(a0)).toEqual({ ...a0, isMatched: undefined })

    const a1: MatchInfoAlgorithm = {
      operator: 'OR',
      criteria: [matchTrue],
    }
    expect(addMatchStatus(a1)).toEqual({ ...a1, isMatched: true })

    const a2: MatchInfoAlgorithm = {
      operator: 'OR',
      criteria: [matchFalse],
    }
    expect(addMatchStatus(a2)).toEqual({ ...a2, isMatched: false })
  })

  test('for multiple match infos, "AND" operator', () => {
    const a0: MatchInfoAlgorithm = {
      operator: 'AND',
      criteria: [matchUndefined, matchUndefined],
    }
    expect(addMatchStatus(a0)).toEqual({ ...a0, isMatched: undefined })

    const a1: MatchInfoAlgorithm = {
      operator: 'AND',
      criteria: [matchUndefined, matchTrue],
    }
    expect(addMatchStatus(a1)).toEqual({ ...a1, isMatched: undefined })

    const a2: MatchInfoAlgorithm = {
      operator: 'AND',
      criteria: [matchUndefined, matchFalse],
    }
    expect(addMatchStatus(a2)).toEqual({ ...a2, isMatched: false })

    const a3: MatchInfoAlgorithm = {
      operator: 'AND',
      criteria: [matchTrue, matchTrue],
    }
    expect(addMatchStatus(a3)).toEqual({ ...a3, isMatched: true })

    const a4: MatchInfoAlgorithm = {
      operator: 'AND',
      criteria: [matchTrue, matchFalse],
    }
    expect(addMatchStatus(a4)).toEqual({ ...a4, isMatched: false })

    const a5: MatchInfoAlgorithm = {
      operator: 'AND',
      criteria: [matchFalse, matchFalse],
    }
    expect(addMatchStatus(a5)).toEqual({ ...a5, isMatched: false })
  })

  test('for multiple match infos, "OR" operator', () => {
    const a0: MatchInfoAlgorithm = {
      operator: 'OR',
      criteria: [matchUndefined, matchUndefined],
    }
    expect(addMatchStatus(a0)).toEqual({ ...a0, isMatched: undefined })

    const a1: MatchInfoAlgorithm = {
      operator: 'OR',
      criteria: [matchUndefined, matchTrue],
    }
    expect(addMatchStatus(a1)).toEqual({ ...a1, isMatched: true })

    const a2: MatchInfoAlgorithm = {
      operator: 'OR',
      criteria: [matchUndefined, matchFalse],
    }
    expect(addMatchStatus(a2)).toEqual({ ...a2, isMatched: undefined })

    const a3: MatchInfoAlgorithm = {
      operator: 'OR',
      criteria: [matchTrue, matchTrue],
    }
    expect(addMatchStatus(a3)).toEqual({ ...a3, isMatched: true })

    const a4: MatchInfoAlgorithm = {
      operator: 'OR',
      criteria: [matchTrue, matchFalse],
    }
    expect(addMatchStatus(a4)).toEqual({ ...a4, isMatched: true })

    const a5: MatchInfoAlgorithm = {
      operator: 'OR',
      criteria: [matchFalse, matchFalse],
    }
    expect(addMatchStatus(a5)).toEqual({ ...a5, isMatched: false })
  })

  test('for a single match algo, "AND" operator', () => {
    const a0: MatchInfoAlgorithm = {
      operator: 'AND',
      criteria: [
        {
          operator: 'AND',
          criteria: [matchUndefined],
        },
      ],
    }
    expect(addMatchStatus(a0)).toEqual({
      ...a0,
      criteria: a0.criteria.map((c) => ({ ...c, isMatched: undefined })),
      isMatched: undefined,
    })

    const a1: MatchInfoAlgorithm = {
      operator: 'AND',
      criteria: [
        {
          operator: 'AND',
          criteria: [matchTrue],
        },
      ],
    }
    expect(addMatchStatus(a1)).toEqual({
      ...a1,
      criteria: a1.criteria.map((c) => ({ ...c, isMatched: true })),
      isMatched: true,
    })

    const a2: MatchInfoAlgorithm = {
      operator: 'AND',
      criteria: [
        {
          operator: 'AND',
          criteria: [matchFalse],
        },
      ],
    }
    expect(addMatchStatus(a2)).toEqual({
      ...a2,
      criteria: a2.criteria.map((c) => ({ ...c, isMatched: false })),
      isMatched: false,
    })
  })

  test('for a single match algo, "OR" operator', () => {
    const a0: MatchInfoAlgorithm = {
      operator: 'OR',
      criteria: [
        {
          operator: 'OR',
          criteria: [matchUndefined],
        },
      ],
    }
    expect(addMatchStatus(a0)).toEqual({
      ...a0,
      criteria: a0.criteria.map((c) => ({ ...c, isMatched: undefined })),
      isMatched: undefined,
    })

    const a1: MatchInfoAlgorithm = {
      operator: 'OR',
      criteria: [
        {
          operator: 'OR',
          criteria: [matchTrue],
        },
      ],
    }
    expect(addMatchStatus(a1)).toEqual({
      ...a1,
      criteria: a1.criteria.map((c) => ({ ...c, isMatched: true })),
      isMatched: true,
    })

    const a2: MatchInfoAlgorithm = {
      operator: 'OR',
      criteria: [
        {
          operator: 'OR',
          criteria: [matchFalse],
        },
      ],
    }
    expect(addMatchStatus(a2)).toEqual({
      ...a2,
      criteria: a2.criteria.map((c) => ({ ...c, isMatched: false })),
      isMatched: false,
    })
  })

  test('for complex cases', () => {
    const a0: MatchInfoAlgorithm = {
      operator: 'AND',
      criteria: [
        matchUndefined,
        {
          operator: 'OR',
          criteria: [matchUndefined, matchTrue],
        },
      ],
    }
    expect(addMatchStatus(a0)).toEqual({
      operator: 'AND',
      criteria: [
        matchUndefined,
        {
          operator: 'OR',
          criteria: [matchUndefined, matchTrue],
          isMatched: true,
        },
      ],
      isMatched: undefined,
    })

    const a1: MatchInfoAlgorithm = {
      operator: 'OR',
      criteria: [
        {
          operator: 'AND',
          criteria: [matchUndefined, matchTrue],
        },
        matchFalse,
      ],
    }
    expect(addMatchStatus(a1)).toEqual({
      operator: 'OR',
      criteria: [
        {
          operator: 'AND',
          criteria: [matchUndefined, matchTrue],
          isMatched: undefined,
        },
        matchFalse,
      ],
      isMatched: undefined,
    })

    const a2: MatchInfoAlgorithm = {
      operator: 'OR',
      criteria: [
        {
          operator: 'AND',
          criteria: [matchUndefined, matchTrue],
        },
        matchFalse,
        {
          operator: 'OR',
          criteria: [
            {
              operator: 'AND',
              criteria: [matchUndefined, matchTrue],
            },
            matchTrue,
          ],
        },
      ],
    }
    expect(addMatchStatus(a2)).toEqual({
      operator: 'OR',
      criteria: [
        {
          operator: 'AND',
          criteria: [matchUndefined, matchTrue],
          isMatched: undefined,
        },
        matchFalse,
        {
          operator: 'OR',
          criteria: [
            {
              operator: 'AND',
              criteria: [matchUndefined, matchTrue],
              isMatched: undefined,
            },
            matchTrue,
          ],
          isMatched: true,
        },
      ],
      isMatched: true,
    })
  })
})

describe('getIsFieldShowing', () => {
  test('for one criterion (in)', () => {
    const showIf: MatchFormFieldShowIfCondition = {
      operator: 'OR',
      criteria: [{ id: 0, operator: 'in', value: [1, 2], is_numeric: true }],
    }
    const values: MatchFormValues = { 0: 1, 1: undefined, 2: undefined }

    expect(getIsFieldShowing(showIf, config, values)).toEqual(true)
  })

  test('for one criterion (gt)', () => {
    const showIf: MatchFormFieldShowIfCondition = {
      operator: 'OR',
      criteria: [{ id: 2, operator: 'gt', value: 1, is_numeric: true }],
    }
    const values: MatchFormValues = { 0: 1, 1: undefined, 2: 2 }

    expect(getIsFieldShowing(showIf, config, values)).toEqual(true)
  })

  test('for multiple criteria (OR)', () => {
    const showIf: MatchFormFieldShowIfCondition = {
      operator: 'OR',
      criteria: [
        { id: 0, operator: 'in', value: [1, 2], is_numeric: true },
        { id: 1, operator: 'eq', value: true, is_numeric: false },
        { id: 2, operator: 'gt', value: 1, is_numeric: true },
      ],
    }
    const values1: MatchFormValues = { 0: 1 }
    expect(getIsFieldShowing(showIf, config, values1)).toEqual(true)

    const values2: MatchFormValues = { 0: 0, 1: true }
    expect(getIsFieldShowing(showIf, config, values2)).toEqual(true)

    const values3: MatchFormValues = { 0: 0, 1: false, 2: 2 }
    expect(getIsFieldShowing(showIf, config, values3)).toEqual(true)

    const values4: MatchFormValues = { 0: 0, 1: false, 2: 1 }
    expect(getIsFieldShowing(showIf, config, values4)).toEqual(false)
  })

  test('for multiple criteria (AND)', () => {
    const showIf: MatchFormFieldShowIfCondition = {
      operator: 'AND',
      criteria: [
        { id: 0, operator: 'in', value: [1, 2], is_numeric: true },
        { id: 1, operator: 'eq', value: true, is_numeric: false },
        { id: 2, operator: 'gt', value: 1, is_numeric: true },
      ],
    }
    const values1: MatchFormValues = { 0: 1 }
    expect(getIsFieldShowing(showIf, config, values1)).toEqual(false)

    const values2: MatchFormValues = { 0: 1, 1: false }
    expect(getIsFieldShowing(showIf, config, values2)).toEqual(false)

    const values3: MatchFormValues = { 0: 1, 1: true, 2: 2 }
    expect(getIsFieldShowing(showIf, config, values3)).toEqual(true)

    const values4: MatchFormValues = { 0: 1, 1: true, 2: 1 }
    expect(getIsFieldShowing(showIf, config, values4)).toEqual(false)
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

describe('getUniqueCritIdsInAlgorithm', () => {
  test('for simple criteria list', () => {
    const algorithm: MatchAlgorithm = {
      operator: 'AND',
      criteria: [0, 0, 1, 2, 2],
    }
    expect(getUniqueCritIdsInAlgorithm(algorithm)).toEqual([0, 1, 2])
  })

  test('for nested criteria list', () => {
    const algorithm: MatchAlgorithm = {
      operator: 'AND',
      criteria: [
        0,
        {
          operator: 'AND',
          criteria: [0, 1, 2, 2],
        },
      ],
    }
    expect(getUniqueCritIdsInAlgorithm(algorithm)).toEqual([0, 1, 2])
  })
})

describe('markRelevantMatchFields', () => {
  const testHelper = (values: MatchFormValues, unmatched: number[]) => {
    // const matchDetails = getMatchDetails(criteria, conditions, config, values)
    // const { unmatched } = getMatchGroups(matchDetails)

    return markRelevantMatchFields({
      criteria,
      conditions,
      fields: config.fields,
      unmatched,
      values,
      studies,
    })
  }

  test('for case without values (no unmatched)', () => {
    const markedFields = testHelper({}, [])
    const expected = config.fields.map((field) => ({
      ...field,
      relevant: field.id !== 3,
    }))
    expect(markedFields).toEqual(expected)
  })

  test('for case with values (no unmatched)', () => {
    const markedFields = testHelper({ 0: 1 }, [])
    const expected = config.fields.map((field) => ({
      ...field,
      relevant: field.id !== 3,
    }))
    expect(markedFields).toEqual(expected)
  })

  test('for case with unmatched', () => {
    const markedFields = testHelper({ 0: 0 }, [0, 2])
    const expected = config.fields.map((field) => ({
      ...field,
      relevant: field.id !== 2 && field.id !== 3,
    }))
    expect(markedFields).toEqual(expected)
  })

  test('for case with unmatched, but with field values set', () => {
    const markedFields = testHelper({ 0: 0, 2: 0 }, [0, 2])
    const expected = config.fields.map((field) => ({
      ...field,
      relevant: field.id !== 3,
    }))
    expect(markedFields).toEqual(expected)
  })
})

describe('getQueryBuilderConfig', () => {
  test('it gets query builder config', () => {
    const matchFormFields: MatchFormFieldConfig[] = [
      {
        id: 1,
        groupId: 1,
        type: 'age',
        name: 'age',
      },
      {
        id: 2,
        groupId: 1,
        type: 'select',
        name: 'sex',
        options: [
          {
            value: 1,
            label: 'Male',
          },
          {
            value: 2,
            label: 'Female',
          },
        ],
      },
      {
        id: 3,
        groupId: 1,
        type: 'select',
        name: 'diagnose',
        options: [
          {
            value: 3,
            label: 'Diabetes',
          },
          {
            value: 4,
            label: 'Heart Disease',
          },
        ],
      },
    ]

    const criteria: EligibilityCriterion[] = [
      {
        id: 1,
        fieldId: 1,
        fieldValue: 22,
        operator: 'lt',
      },
      {
        id: 2,
        fieldId: 2,
        fieldValue: 1,
        operator: 'eq',
      },
    ]
    const expectedFields: Fields = {
      '1': {
        label: 'age < 22',
        type: 'number',
        fieldSettings: { min: 0 },
        defaultOperator: 'less',
        defaultValue: 22,
      },
      '2': {
        label: 'sex == Male',
        type: 'select',
        defaultValue: 1,
        defaultOperator: 'select_equals',
        fieldSettings: {
          listValues: [
            {
              value: 1,
              title: 'Male',
            },
            { value: 2, title: 'Female' },
          ],
        },
      },
    }
    const queryBuilderConfig = getQueryBuilderConfig(matchFormFields, criteria)
    const { immutableValuesMode, immutableOpsMode } =
      queryBuilderConfig.settings
    expect(queryBuilderConfig.fields).toEqual(expectedFields)
    expect(immutableValuesMode).toBeTruthy()
    expect(immutableOpsMode).toBeTruthy()
  })
})

const algorithm: MatchAlgorithm = {
  operator: 'AND',
  criteria: [
    {
      operator: 'OR',
      criteria: [
        {
          operator: 'AND',
          criteria: [1, 2],
        },
        {
          operator: 'OR',
          criteria: [6],
        },
      ],
    },
    {
      operator: 'AND',
      criteria: [3, 4, 5],
    },
  ],
}
const jsonGroup: JsonGroup = {
  children1: [
    {
      children1: [
        {
          children1: [
            {
              id: '1',
              properties: {
                field: '1',
                operator: 'less',
                value: [22],
                valueSrc: ['value'],
                valueType: ['number'],
              },
              type: 'rule',
            },
            {
              id: '1',
              properties: {
                field: '2',
                operator: 'equal',
                value: ['Male'],
                valueSrc: ['value'],
                valueType: ['number'],
              },
              type: 'rule',
            },
          ],
          id: '1',
          properties: {
            conjunction: 'AND',
          },
          type: 'group',
        },
        {
          children1: [
            {
              id: '1',
              properties: {
                field: '6',
                operator: 'greater',
                value: [0.2],
                valueSrc: ['value'],
                valueType: ['number'],
              },
              type: 'rule',
            },
          ],
          id: '1',
          properties: {
            conjunction: 'OR',
          },
          type: 'group',
        },
      ],
      id: '1',
      properties: {
        conjunction: 'OR',
      },
      type: 'group',
    },
    {
      children1: [
        {
          id: '1',
          properties: {
            field: '3',
            operator: 'equal',
            value: ['Heart Disease'],
            valueSrc: ['value'],
            valueType: ['number'],
          },
          type: 'rule',
        },
        {
          id: '1',
          properties: {
            field: '4',
            operator: 'equal',
            value: ['Cancer'],
            valueSrc: ['value'],
            valueType: ['number'],
          },
          type: 'rule',
        },
        {
          id: '1',
          properties: {
            field: '5',
            operator: 'less_or_equal',
            value: [0.4],
            valueSrc: ['value'],
            valueType: ['number'],
          },
          type: 'rule',
        },
      ],
      id: '1',
      properties: {
        conjunction: 'AND',
      },
      type: 'group',
    },
  ],
  id: '1',
  properties: {
    conjunction: 'AND',
  },
  type: 'group',
}
describe('getQueryBuilderValue', () => {
  test('when algorithm is undefined or null', () => {
    jest.spyOn(QbUtils, 'uuid').mockReturnValue('1')
    const expected: JsonGroup = {
      id: '1',
      type: 'group',
    }
    expect(
      getQueryBuilderValue(undefined, [], { groups: [], fields: [] })
    ).toEqual(expected)
    expect(getQueryBuilderValue(null, [], { groups: [], fields: [] })).toEqual(
      expected
    )
  })

  test('when algorithm is not undefined or null', () => {
    jest.spyOn(QbUtils, 'uuid').mockReturnValue('1')

    const eligibilityCriteria: EligibilityCriterion[] = [
      {
        id: 1,
        fieldId: 1,
        fieldValue: 22,
        operator: 'lt',
      },
      {
        id: 2,
        fieldId: 2,
        fieldValue: 'Male',
        operator: 'eq',
      },
      {
        id: 3,
        fieldId: 3,
        fieldValue: 'Heart Disease',
        operator: 'eq',
      },
      {
        id: 4,
        fieldId: 4,
        fieldValue: 'Cancer',
        operator: 'eq',
      },
      {
        id: 5,
        fieldId: 5,
        fieldValue: 0.4,
        operator: 'lte',
      },
      {
        id: 6,
        fieldId: 6,
        fieldValue: 0.2,
        operator: 'gt',
      },
    ]

    const matchForm: MatchFormConfig = {
      groups: [
        {
          id: 1,
          name: 'group 1',
        },
      ],
      fields: [
        {
          id: 1,
          groupId: 1,
          name: 'age',
          type: 'age',
        },
        {
          id: 2,
          groupId: 1,
          name: 'sex',
          type: 'select',
        },
        {
          id: 3,
          groupId: 1,
          name: 'med_condition',
          type: 'select',
        },
        {
          id: 4,
          groupId: 1,
          name: 'past_med_condition',
          type: 'select',
        },
        {
          id: 5,
          groupId: 1,
          name: 'blood_pressure',
          type: 'number',
        },
        {
          id: 6,
          groupId: 1,
          name: 'body_fat',
          type: 'number',
        },
      ],
    }

    expect(
      getQueryBuilderValue(algorithm, eligibilityCriteria, matchForm)
    ).toEqual(jsonGroup)
  })
})

describe('queryBuilderValueToAlgorithm', () => {
  test('convert json group to study algorithm', () => {
    expect(queryBuilderValueToAlgorithm(jsonGroup)).toEqual(algorithm)
  })
})

describe('getShowIfDetails', () => {
  test('convert fields and showIf to readable match info', () => {
    const fields: MatchFormFieldConfig[] = [
      {
        id: 1,
        groupId: 1,
        name: 'weight',
        type: 'number',
        label: 'What is the patient weight',
        showIf: {
          operator: 'AND',
          criteria: [
            {
              id: 2,
              operator: 'in',
              value: ['Med1', 'Med2'],
              is_numeric: false,
            },
          ],
        },
      },
      {
        id: 2,
        groupId: 1,
        name: 'medications',
        type: 'multiselect',
        label: 'What is the patient medications',
        options: [
          {
            value: 'Med1',
            label: 'Medication 1',
          },
          {
            value: 'Med2',
            label: 'Medication 2',
          },
          {
            value: 'Med3',
            label: 'Medication 3',
          },
        ],
      },
      {
        id: 3,
        groupId: 1,
        name: 'gender',
        type: 'select',
        options: [
          { value: 'M', label: 'Male' },
          { value: 'F', label: 'Female' },
        ],
        showIf: {
          operator: 'AND',
          criteria: [
            { id: 1, operator: 'gt', value: 160, is_numeric: true },
            { id: 2, operator: 'eq', value: 'Med3', is_numeric: false },
          ],
        },
      },
    ]
    expect(
      fields[0].showIf && getShowIfDetails(fields, fields[0].showIf)
    ).toEqual({
      operator: 'AND',
      criteria: [
        {
          fieldName: 'What is the patient medications',
          fieldValue: ['Med1', 'Med2'],
          fieldValueLabel: ['Medication 1', 'Medication 2'],
          operator: 'in',
        },
      ],
    })
    expect(
      fields[2].showIf && getShowIfDetails(fields, fields[2].showIf)
    ).toEqual({
      operator: 'AND',
      criteria: [
        {
          fieldName: 'What is the patient weight',
          fieldValue: 160,
          operator: 'gt',
        },
        {
          fieldName: 'What is the patient medications',
          fieldValue: 'Med3',
          fieldValueLabel: 'Medication 3',
          operator: 'eq',
        },
      ],
    })
  })
})
