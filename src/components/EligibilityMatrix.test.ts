import type { MatchInfoAlgorithm } from '../model'
import {
  getEligibilityPaths,
  getPathStatus,
  orderEligibilityPaths,
} from './EligibilityMatrix'

const criterion = (
  fieldName: string,
  isMatched: boolean | undefined = true
) => ({
  fieldName,
  fieldValue: 1,
  isMatched,
  operator: 'eq' as const,
})

const undeterminedCriterion = (fieldName: string) => ({
  ...criterion(fieldName),
  isMatched: undefined,
})

test('expands nested AND and OR logic into complete eligibility paths', () => {
  const algorithm: MatchInfoAlgorithm = {
    operator: 'AND',
    criteria: [
      criterion('Age'),
      {
        operator: 'OR',
        criteria: [
          criterion('Marrow blasts'),
          {
            operator: 'AND',
            criteria: [criterion('Blood blasts'), criterion('Confirmation')],
          },
        ],
      },
    ],
  }

  expect(
    getEligibilityPaths(algorithm).map((path) =>
      path.map(({ fieldName }) => fieldName)
    )
  ).toEqual([
    ['Age', 'Marrow blasts'],
    ['Age', 'Blood blasts', 'Confirmation'],
  ])
})

test('preserves repeated variables in the same path', () => {
  const algorithm: MatchInfoAlgorithm = {
    operator: 'AND',
    criteria: [criterion('Blasts'), criterion('Blasts', false)],
  }

  expect(getEligibilityPaths(algorithm)[0]).toHaveLength(2)
})

test('uses the overall trial status for an otherwise matched path', () => {
  const matchedPath = [criterion('Age'), criterion('Diagnosis')]

  expect(getPathStatus(matchedPath, true)).toBe(true)
  expect(getPathStatus(matchedPath, undefined)).toBeUndefined()
  expect(getPathStatus(matchedPath, false)).toBe(false)
})

test('keeps a path failed when one of its criteria failed', () => {
  const failedPath = [criterion('Age'), criterion('Diagnosis', false)]

  expect(getPathStatus(failedPath, undefined)).toBe(false)
})

test('orders paths by status and then distance to a match', () => {
  const matched = [criterion('Matched')]
  const undeterminedClose = [undeterminedCriterion('Missing')]
  const undeterminedFar = [
    undeterminedCriterion('Missing one'),
    undeterminedCriterion('Missing two'),
  ]
  const unmatchedClose = [criterion('Failed', false)]
  const unmatchedFar = [
    criterion('Failed one', false),
    criterion('Failed two', false),
  ]

  expect(
    orderEligibilityPaths(
      [unmatchedFar, undeterminedFar, matched, unmatchedClose, undeterminedClose],
      true
    )
  ).toEqual([
    matched,
    undeterminedClose,
    undeterminedFar,
    unmatchedClose,
    unmatchedFar,
  ])
})

test('counts a repeated variable only once when ordering paths', () => {
  const repeatedVariable = [
    criterion('Blasts', false),
    undeterminedCriterion('Blasts'),
  ]
  const twoVariables = [
    criterion('Age', false),
    undeterminedCriterion('Diagnosis'),
  ]

  expect(orderEligibilityPaths([twoVariables, repeatedVariable], true)).toEqual([
    repeatedVariable,
    twoVariables,
  ])
})
