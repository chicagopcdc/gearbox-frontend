import type {
  EligibilityCriterion,
  MatchAlgorithm,
  MatchCondition,
  MatchFormValues,
  MatchFormConfig,
  MatchFormFieldShowIfCondition,
  MatchInfoAlgorithm,
  MatchInfo,
} from './model'
import {
  addMatchStatus,
  getMatchDetails,
  getMatchGroups,
  getIsFieldShowing,
  getFieldOptionLabelMap,
  getUniqueCritIdsInAlgorithm,
  markRelevantMatchFields,
} from './utils'

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
      type: '',
      options: [
        { label: 'foo', value: 0 },
        { label: 'bar', value: 1 },
        { label: 'baz', value: 2 },
      ],
    },
    { id: 1, name: 'field 1', groupId: 0, type: '' },
    { id: 2, name: 'field 2', groupId: 0, type: '' },
    {
      id: 3,
      name: 'field 3',
      groupId: 0,
      type: '',
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

describe('getMatchGroups', () => {
  const getMatchGroupsTestHelper = (values: MatchFormValues) =>
    getMatchGroups(getMatchDetails(criteria, conditions, config, values))

  test('for simple AND algorithm', () => {
    const values: MatchFormValues = {
      0: 1,
      1: false,
    }
    expect(getMatchGroupsTestHelper(values)).toEqual({
      matched: [0, 1],
      undetermined: [2, 3],
      unmatched: [],
    })
  })

  test('for simple OR algorithm', () => {
    const values: MatchFormValues = {
      0: 0,
      1: true,
    }
    expect(getMatchGroupsTestHelper(values)).toEqual({
      matched: [1],
      undetermined: [3],
      unmatched: [0, 2],
    })
  })

  test('for nested algorithm 1', () => {
    const values: MatchFormValues = {
      0: 1,
      2: 1,
    }
    expect(getMatchGroupsTestHelper(values)).toEqual({
      matched: [1, 2],
      undetermined: [0, 3],
      unmatched: [],
    })
  })

  test('for nested algorithm 2', () => {
    const values: MatchFormValues = {
      1: false,
      2: 0,
    }
    expect(getMatchGroupsTestHelper(values)).toEqual({
      matched: [],
      undetermined: [0, 1, 3],
      unmatched: [2],
    })
  })

  test('for no input', () => {
    const values: MatchFormValues = {}
    expect(getMatchGroupsTestHelper(values)).toEqual({
      matched: [],
      undetermined: [0, 1, 2, 3],
      unmatched: [],
    })
  })

  test('for "Not sure" option', () => {
    const valuesWithMatch: MatchFormValues = {
      3: 0,
    }
    expect(getMatchGroupsTestHelper(valuesWithMatch)).toEqual({
      matched: [3],
      undetermined: [0, 1, 2],
      unmatched: [],
    })

    const valuesWithUnmatch: MatchFormValues = {
      3: 1,
    }
    expect(getMatchGroupsTestHelper(valuesWithUnmatch)).toEqual({
      matched: [],
      undetermined: [0, 1, 2],
      unmatched: [3],
    })

    const valuesWithNotSure: MatchFormValues = {
      3: 2,
    }
    expect(getMatchGroupsTestHelper(valuesWithNotSure)).toEqual({
      matched: [],
      undetermined: [0, 1, 2, 3],
      unmatched: [],
    })
  })
})

describe('getIsFieldShowing', () => {
  test('for one criterion (in)', () => {
    const showIf: MatchFormFieldShowIfCondition = {
      operator: 'OR',
      criteria: [{ id: 0, operator: 'in', value: [1, 2] }],
    }
    const values: MatchFormValues = { 0: 1, 1: undefined, 2: undefined }

    expect(getIsFieldShowing(showIf, config.fields, values)).toEqual(true)
  })

  test('for one criterion (gt)', () => {
    const showIf: MatchFormFieldShowIfCondition = {
      operator: 'OR',
      criteria: [{ id: 2, operator: 'gt', value: 1 }],
    }
    const values: MatchFormValues = { 0: 1, 1: undefined, 2: 2 }

    expect(getIsFieldShowing(showIf, config.fields, values)).toEqual(true)
  })

  test('for multiple criteria (OR)', () => {
    const showIf: MatchFormFieldShowIfCondition = {
      operator: 'OR',
      criteria: [
        { id: 0, operator: 'in', value: [1, 2] },
        { id: 1, operator: 'eq', value: true },
        { id: 2, operator: 'gt', value: 1 },
      ],
    }
    const values1: MatchFormValues = { 0: 1 }
    expect(getIsFieldShowing(showIf, config.fields, values1)).toEqual(true)

    const values2: MatchFormValues = { 0: 0, 1: true }
    expect(getIsFieldShowing(showIf, config.fields, values2)).toEqual(true)

    const values3: MatchFormValues = { 0: 0, 1: false, 2: 2 }
    expect(getIsFieldShowing(showIf, config.fields, values3)).toEqual(true)

    const values4: MatchFormValues = { 0: 0, 1: false, 2: 1 }
    expect(getIsFieldShowing(showIf, config.fields, values4)).toEqual(false)
  })

  test('for multiple criteria (AND)', () => {
    const showIf: MatchFormFieldShowIfCondition = {
      operator: 'AND',
      criteria: [
        { id: 0, operator: 'in', value: [1, 2] },
        { id: 1, operator: 'eq', value: true },
        { id: 2, operator: 'gt', value: 1 },
      ],
    }
    const values1: MatchFormValues = { 0: 1 }
    expect(getIsFieldShowing(showIf, config.fields, values1)).toEqual(false)

    const values2: MatchFormValues = { 0: 1, 1: false }
    expect(getIsFieldShowing(showIf, config.fields, values2)).toEqual(false)

    const values3: MatchFormValues = { 0: 1, 1: true, 2: 2 }
    expect(getIsFieldShowing(showIf, config.fields, values3)).toEqual(true)

    const values4: MatchFormValues = { 0: 1, 1: true, 2: 1 }
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
  const testHelper = (values: MatchFormValues) => {
    const matchDetails = getMatchDetails(criteria, conditions, config, values)
    const { unmatched } = getMatchGroups(matchDetails)

    return [
      unmatched,
      markRelevantMatchFields({
        criteria,
        conditions,
        fields: config.fields,
        unmatched,
        values,
      }),
    ]
  }

  test('for case without values (no unmatched)', () => {
    const [unmatched, markedFields] = testHelper({})
    const expected = config.fields.map((field) => ({
      ...field,
      relevant: true,
    }))
    expect(unmatched).toEqual([])
    expect(markedFields).toEqual(expected)
  })

  test('for case with values (no unmatched)', () => {
    const [unmatched, markedFields] = testHelper({ 0: 1 })
    const expected = config.fields.map((field) => ({
      ...field,
      relevant: true,
    }))
    expect(unmatched).toEqual([])
    expect(markedFields).toEqual(expected)
  })

  test('for case with unmatched', () => {
    const [unmatched, markedFields] = testHelper({ 0: 0 })
    const expected = config.fields.map((field) => ({
      ...field,
      relevant: field.id !== 2,
    }))
    expect(unmatched).toEqual([0, 2])
    expect(markedFields).toEqual(expected)
  })

  test('for case with unmatched, but with field values set', () => {
    const [unmatched, markedFields] = testHelper({ 0: 0, 2: 0 })
    const expected = config.fields.map((field) => ({
      ...field,
      relevant: true,
    }))
    expect(unmatched).toEqual([0, 2])
    expect(markedFields).toEqual(expected)
  })
})
