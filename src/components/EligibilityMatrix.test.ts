import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import type { MatchInfoAlgorithm } from '../model'
import {
  default as EligibilityMatrix,
  countEligibilityPaths,
  compareEligibilityPaths,
  getEligibilityPathRange,
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

const alternatives = (prefix: string, count: number): MatchInfoAlgorithm => ({
  operator: 'OR',
  criteria: Array.from({ length: count }, (_, index) =>
    criterion(`${prefix} ${index + 1}`)
  ),
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

test('counts the combinations created by nested AND and OR logic', () => {
  const algorithm: MatchInfoAlgorithm = {
    operator: 'AND',
    criteria: Array.from({ length: 9 }, (_, index) =>
      alternatives(`Group ${index + 1}`, 3)
    ),
  }

  expect(countEligibilityPaths(algorithm)).toBe(3 ** 9)
  expect(getEligibilityPaths(algorithm)).toHaveLength(3 ** 9)
})

test('generates only a requested range without expanding every path', () => {
  const algorithm: MatchInfoAlgorithm = {
    operator: 'AND',
    criteria: [alternatives('First', 3), alternatives('Second', 3)],
  }

  expect(
    getEligibilityPathRange(algorithm, 3, 2).map((path) =>
      path.map(({ fieldName }) => fieldName)
    )
  ).toEqual([
    ['First 2', 'Second 1'],
    ['First 2', 'Second 2'],
  ])
})

test('renders only the first page of a matrix with thousands of paths', async () => {
  const algorithm: MatchInfoAlgorithm = {
    operator: 'AND',
    criteria: Array.from({ length: 9 }, (_, index) =>
      alternatives(`Group ${index + 1}`, 3)
    ),
  }

  const { container } = render(
    React.createElement(EligibilityMatrix, {
      matchInfoAlgorithm: algorithm,
      overallStatus: true,
    })
  )

  expect(screen.getByRole('status')).toHaveTextContent(
    'Preparing eligibility paths'
  )
  await screen.findByText('Showing paths 1–50 of 19683', {}, { timeout: 5000 })
  expect(container.querySelectorAll('tbody tr')).toHaveLength(50)
})

test('renders the first page while the remaining paths are still preparing', () => {
  const idleCallbacks: IdleRequestCallback[] = []
  const idleWindow = window as Window & {
    requestIdleCallback?: (callback: () => void) => number
  }
  const originalRequestIdleCallback = idleWindow.requestIdleCallback
  idleWindow.requestIdleCallback = (callback) => {
    idleCallbacks.push(callback)
    return idleCallbacks.length
  }

  try {
    const algorithm: MatchInfoAlgorithm = {
      operator: 'OR',
      criteria: Array.from({ length: 401 }, (_, index) =>
        criterion(`Criterion ${index + 1}`)
      ),
    }

    const { container } = render(
      React.createElement(EligibilityMatrix, {
        matchInfoAlgorithm: algorithm,
        overallStatus: true,
      })
    )

    expect(container.querySelector('table')).not.toBeInTheDocument()

    act(() =>
      idleCallbacks.shift()?.({
        didTimeout: false,
        timeRemaining: () => 50,
      })
    )

    expect(screen.getByRole('status')).toHaveTextContent(
      'Preparing eligibility paths… 200 of 401'
    )
    expect(container.querySelectorAll('tbody tr')).toHaveLength(50)
    expect(idleCallbacks).toHaveLength(1)
  } finally {
    idleWindow.requestIdleCallback = originalRequestIdleCallback
  }
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

test('shows the backend status when a patient value is missing', async () => {
  const algorithm: MatchInfoAlgorithm = {
    operator: 'AND',
    criteria: [undeterminedCriterion('Eligible')],
  }

  render(
    React.createElement(EligibilityMatrix, {
      matchInfoAlgorithm: algorithm,
      overallStatus: true,
      patientValues: {},
    })
  )

  expect(
    await screen.findByLabelText(
      'To be determined. Patient value: Not entered. Required: = 1'
    )
  ).toBeInTheDocument()

  expect(screen.getByTitle('To be determined')).toBeInTheDocument()
})

test('shows a null backend status as to be determined', async () => {
  const algorithm: MatchInfoAlgorithm = {
    operator: 'AND',
    criteria: [
      {
        ...criterion('Eligible'),
        isMatched: null as unknown as undefined,
      },
    ],
  }

  render(
    React.createElement(EligibilityMatrix, {
      matchInfoAlgorithm: algorithm,
      overallStatus: undefined,
      patientValues: {},
    })
  )

  expect(
    await screen.findByLabelText(
      'To be determined. Patient value: Not entered. Required: = 1'
    )
  ).toBeInTheDocument()
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
      [
        unmatchedFar,
        undeterminedFar,
        matched,
        unmatchedClose,
        undeterminedClose,
      ],
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

test('exposes the same comparator used to order paths', () => {
  const matched = [criterion('Matched')]
  const unmatched = [criterion('Failed', false)]

  expect(compareEligibilityPaths(matched, unmatched, true)).toBeLessThan(0)
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

  expect(orderEligibilityPaths([twoVariables, repeatedVariable], true)).toEqual(
    [repeatedVariable, twoVariables]
  )
})

test('renders large matrices one page at a time', async () => {
  const algorithm: MatchInfoAlgorithm = {
    operator: 'OR',
    criteria: Array.from({ length: 51 }, (_, index) =>
      criterion(`Criterion ${index + 1}`)
    ),
  }

  const { container } = render(
    React.createElement(EligibilityMatrix, {
      matchInfoAlgorithm: algorithm,
      overallStatus: true,
    })
  )

  await screen.findByText('Showing paths 1–50 of 51')
  expect(container.querySelectorAll('tbody tr')).toHaveLength(50)

  fireEvent.click(screen.getByRole('button', { name: 'Next' }))

  await waitFor(() => {
    expect(screen.getByText('Showing paths 51–51 of 51')).toBeInTheDocument()
    expect(container.querySelectorAll('tbody tr')).toHaveLength(1)
  })
})

test('does not expand a Boolean tree that exceeds the heatmap safety limit', () => {
  const algorithm: MatchInfoAlgorithm = {
    operator: 'AND',
    criteria: Array.from({ length: 16 }, (_, groupIndex) => ({
      operator: 'OR' as const,
      criteria: Array.from({ length: 2 }, (_, criterionIndex) =>
        criterion(`Group ${groupIndex + 1}-${criterionIndex + 1}`)
      ),
    })),
  }

  render(
    React.createElement(EligibilityMatrix, {
      matchInfoAlgorithm: algorithm,
      overallStatus: true,
    })
  )

  expect(
    screen.getByText(/expands to 65,536 eligibility paths/)
  ).toBeInTheDocument()
  expect(screen.queryByRole('table')).not.toBeInTheDocument()
})
