import { useEffect, useMemo, useState } from 'react'
import { ZoomIn, ZoomOut } from 'react-feather'
import type { MatchInfo, MatchInfoAlgorithm } from '../model'

export type EligibilityPath = MatchInfo[]

const PATHS_PER_PAGE = 50
const MAX_HEATMAP_PATHS = 50000
const PATH_PREPARATION_BATCH_SIZE = 200

function isAlgorithm(
  criterion: MatchInfo | MatchInfoAlgorithm
): criterion is MatchInfoAlgorithm {
  return Object.prototype.hasOwnProperty.call(criterion, 'criteria')
}

export function getEligibilityPaths(
  algorithm: MatchInfoAlgorithm
): EligibilityPath[] {
  const childPaths = algorithm.criteria.map((criterion) =>
    isAlgorithm(criterion) ? getEligibilityPaths(criterion) : [[criterion]]
  )

  if (algorithm.operator === 'OR') return childPaths.flat()

  return childPaths.reduce<EligibilityPath[]>(
    (paths, nextPaths) =>
      paths.flatMap((path) =>
        nextPaths.map((nextPath) => [...path, ...nextPath])
      ),
    [[]]
  )
}

export function countEligibilityPaths(algorithm: MatchInfoAlgorithm): number {
  const childCounts = algorithm.criteria.map((criterion) =>
    isAlgorithm(criterion) ? countEligibilityPaths(criterion) : 1
  )

  if (algorithm.operator === 'OR')
    return childCounts.reduce((total, count) => total + count, 0)

  return childCounts.reduce((total, count) => total * count, 1)
}

function getEligibilityPathAtIndex(
  algorithm: MatchInfoAlgorithm,
  pathIndex: number
): EligibilityPath {
  if (algorithm.operator === 'OR') {
    let remainingIndex = pathIndex

    for (const criterion of algorithm.criteria) {
      const criterionPathCount = isAlgorithm(criterion)
        ? countEligibilityPaths(criterion)
        : 1

      if (remainingIndex < criterionPathCount)
        return isAlgorithm(criterion)
          ? getEligibilityPathAtIndex(criterion, remainingIndex)
          : [criterion]

      remainingIndex -= criterionPathCount
    }

    return []
  }

  const childCounts = algorithm.criteria.map((criterion) =>
    isAlgorithm(criterion) ? countEligibilityPaths(criterion) : 1
  )

  return algorithm.criteria.flatMap((criterion, criterionIndex) => {
    if (!isAlgorithm(criterion)) return [criterion]

    const pathsAfterCriterion = childCounts
      .slice(criterionIndex + 1)
      .reduce((total, count) => total * count, 1)
    const criterionPathIndex =
      Math.floor(pathIndex / pathsAfterCriterion) % childCounts[criterionIndex]

    return getEligibilityPathAtIndex(criterion, criterionPathIndex)
  })
}

export function getEligibilityPathRange(
  algorithm: MatchInfoAlgorithm,
  firstPathIndex: number,
  pathCount: number
): EligibilityPath[] {
  const totalPathCount = countEligibilityPaths(algorithm)
  const lastPathIndex = Math.min(firstPathIndex + pathCount, totalPathCount)

  return Array.from(
    { length: Math.max(0, lastPathIndex - firstPathIndex) },
    (_, index) => getEligibilityPathAtIndex(algorithm, firstPathIndex + index)
  )
}

function getEligibilityColumns(algorithm: MatchInfoAlgorithm): string[] {
  const columns = new Set<string>()

  const addColumns = (currentAlgorithm: MatchInfoAlgorithm) => {
    currentAlgorithm.criteria.forEach((criterion) => {
      if (isAlgorithm(criterion)) addColumns(criterion)
      else columns.add(criterion.fieldName)
    })
  }

  addColumns(algorithm)
  return Array.from(columns)
}

function getStatus(criteria: MatchInfo[]): boolean | undefined {
  if (criteria.some(({ isMatched }) => isMatched === false)) return false
  if (criteria.some(({ isMatched }) => isMatched === undefined))
    return undefined
  return true
}

export function getPathStatus(
  criteria: MatchInfo[],
  overallStatus: boolean | undefined
): boolean | undefined {
  const criteriaStatus = getStatus(criteria)

  return criteriaStatus === true ? overallStatus : criteriaStatus
}

function getDistanceToMatch(criteria: MatchInfo[]): number {
  const criteriaByField = new Map<string, MatchInfo[]>()

  criteria.forEach((criterion) => {
    const fieldCriteria = criteriaByField.get(criterion.fieldName) ?? []
    fieldCriteria.push(criterion)
    criteriaByField.set(criterion.fieldName, fieldCriteria)
  })

  return Array.from(criteriaByField.values()).filter(
    (fieldCriteria) => getStatus(fieldCriteria) !== true
  ).length
}

export function orderEligibilityPaths(
  paths: EligibilityPath[],
  overallStatus: boolean | undefined
): EligibilityPath[] {
  return paths
    .map((path, originalIndex) => ({ path, originalIndex }))
    .sort((left, right) =>
      compareEligibilityPaths(
        left.path,
        right.path,
        overallStatus,
        left.originalIndex,
        right.originalIndex
      )
    )
    .map(({ path }) => path)
}

export function compareEligibilityPaths(
  leftPath: EligibilityPath,
  rightPath: EligibilityPath,
  overallStatus: boolean | undefined,
  leftOriginalIndex = 0,
  rightOriginalIndex = 0
): number {
  const statusOrder = (status: boolean | undefined) =>
    status === true ? 0 : status === undefined ? 1 : 2
  const statusDifference =
    statusOrder(getPathStatus(leftPath, overallStatus)) -
    statusOrder(getPathStatus(rightPath, overallStatus))

  if (statusDifference !== 0) return statusDifference

  const distanceDifference =
    getDistanceToMatch(leftPath) - getDistanceToMatch(rightPath)

  return distanceDifference || leftOriginalIndex - rightOriginalIndex
}

type IndexedEligibilityPath = {
  originalIndex: number
  path: EligibilityPath
}

function mergeOrderedPaths(
  leftPaths: IndexedEligibilityPath[],
  rightPaths: IndexedEligibilityPath[],
  overallStatus: boolean | undefined
): IndexedEligibilityPath[] {
  const mergedPaths: IndexedEligibilityPath[] = []
  let leftIndex = 0
  let rightIndex = 0

  while (leftIndex < leftPaths.length && rightIndex < rightPaths.length) {
    const leftPath = leftPaths[leftIndex]
    const rightPath = rightPaths[rightIndex]
    const comparison = compareEligibilityPaths(
      leftPath.path,
      rightPath.path,
      overallStatus,
      leftPath.originalIndex,
      rightPath.originalIndex
    )

    if (comparison <= 0) {
      mergedPaths.push(leftPath)
      leftIndex += 1
    } else {
      mergedPaths.push(rightPath)
      rightIndex += 1
    }
  }

  return mergedPaths.concat(
    leftPaths.slice(leftIndex),
    rightPaths.slice(rightIndex)
  )
}

function scheduleIdleWork(callback: () => void): () => void {
  const idleWindow = window as Window & {
    cancelIdleCallback?: (handle: number) => void
    requestIdleCallback?: (callback: () => void) => number
  }

  if (idleWindow.requestIdleCallback) {
    const handle = idleWindow.requestIdleCallback(callback)
    return () => idleWindow.cancelIdleCallback?.(handle)
  }

  const handle = window.setTimeout(callback, 0)
  return () => window.clearTimeout(handle)
}

function getOperatorLabel(operator: MatchInfo['operator']) {
  switch (operator) {
    case 'eq':
      return '='
    case 'gt':
      return '>'
    case 'gte':
      return '≥'
    case 'lt':
      return '<'
    case 'lte':
      return '≤'
    case 'ne':
      return '≠'
    case 'in':
      return 'is one of'
  }
}

function formatValue(value: unknown): string {
  if (value === undefined || value === null || value === '')
    return 'Not entered'
  if (Array.isArray(value)) return value.map(formatValue).join(', ')
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value)
}

function getStatusLabel(status: boolean | undefined) {
  return status === true
    ? 'Matched'
    : status === false
    ? 'Did not match'
    : 'To be determined'
}

function getStatusClasses(status: boolean | undefined) {
  return status === true
    ? 'border-blue-300 bg-blue-100 text-blue-900'
    : status === false
    ? 'border-red-300 bg-red-100 text-red-900'
    : 'border-gray-300 bg-gray-200 text-gray-800'
}

type EligibilityMatrixProps = {
  matchInfoAlgorithm: MatchInfoAlgorithm
  overallStatus: boolean | undefined
  patientValues?: Record<string, unknown>
}

function EligibilityMatrix({
  matchInfoAlgorithm,
  overallStatus,
  patientValues = {},
}: EligibilityMatrixProps) {
  const [isDetailedView, setIsDetailedView] = useState(false)
  const [page, setPage] = useState(0)
  const [paths, setPaths] = useState<EligibilityPath[]>([])
  const [processedPathCount, setProcessedPathCount] = useState(0)
  const pathCount = useMemo(
    () => countEligibilityPaths(matchInfoAlgorithm),
    [matchInfoAlgorithm]
  )
  const isPathLimitExceeded = pathCount > MAX_HEATMAP_PATHS
  const isPreparingPaths =
    !isPathLimitExceeded && processedPathCount < pathCount
  const columns = useMemo(
    () => getEligibilityColumns(matchInfoAlgorithm),
    [matchInfoAlgorithm]
  )
  const pageCount = Math.max(1, Math.ceil(pathCount / PATHS_PER_PAGE))
  const visiblePaths = useMemo(() => {
    const firstPathIndex = page * PATHS_PER_PAGE
    const pagePaths = paths.slice(
      firstPathIndex,
      firstPathIndex + PATHS_PER_PAGE
    )

    return pagePaths.map((path, visiblePathIndex) => {
      const criteriaByColumn = new Map<string, MatchInfo[]>()

      path.forEach((criterion) => {
        const criteria = criteriaByColumn.get(criterion.fieldName) ?? []
        criteria.push(criterion)
        criteriaByColumn.set(criterion.fieldName, criteria)
      })

      return {
        criteriaByColumn,
        pathIndex: firstPathIndex + visiblePathIndex,
        pathStatus: getPathStatus(path, overallStatus),
      }
    })
  }, [overallStatus, page, paths])

  useEffect(() => {
    setPaths([])
    setProcessedPathCount(0)

    if (isPathLimitExceeded || pathCount === 0) return

    let isCancelled = false
    let cancelScheduledWork: (() => void) | undefined
    let nextPathIndex = 0
    let orderedPaths: IndexedEligibilityPath[] = []

    const prepareNextBatch = () => {
      if (isCancelled) return

      const batchPaths = getEligibilityPathRange(
        matchInfoAlgorithm,
        nextPathIndex,
        PATH_PREPARATION_BATCH_SIZE
      ).map((path, batchIndex) => ({
        originalIndex: nextPathIndex + batchIndex,
        path,
      }))

      batchPaths.sort((left, right) =>
        compareEligibilityPaths(
          left.path,
          right.path,
          overallStatus,
          left.originalIndex,
          right.originalIndex
        )
      )
      orderedPaths = mergeOrderedPaths(orderedPaths, batchPaths, overallStatus)
      nextPathIndex += batchPaths.length
      setPaths(orderedPaths.map(({ path }) => path))
      setProcessedPathCount(nextPathIndex)

      if (nextPathIndex < pathCount) {
        cancelScheduledWork = scheduleIdleWork(prepareNextBatch)
      }
    }

    cancelScheduledWork = scheduleIdleWork(prepareNextBatch)

    return () => {
      isCancelled = true
      cancelScheduledWork?.()
    }
  }, [isPathLimitExceeded, matchInfoAlgorithm, overallStatus, pathCount])

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, pageCount - 1))
  }, [pageCount])

  useEffect(() => setPage(0), [matchInfoAlgorithm])

  const firstVisiblePath = pathCount ? page * PATHS_PER_PAGE + 1 : 0
  const lastVisiblePath = Math.min((page + 1) * PATHS_PER_PAGE, pathCount)
  const getCellDetails = (criteria: MatchInfo[], column: string) => {
    const status = getStatus(criteria)
    const requirements = criteria
      .map(
        ({ fieldValue, fieldValueLabel, operator }) =>
          `${getOperatorLabel(operator)} ${formatValue(
            fieldValueLabel ?? fieldValue
          )}`
      )
      .join('; ')

    return `${getStatusLabel(status)}. Patient value: ${formatValue(
      patientValues[column]
    )}. Required: ${requirements}`
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-4 text-sm">
          {[
            ['bg-blue-100 border-blue-300', 'Matched'],
            ['bg-red-100 border-red-300', 'Did not match'],
            ['bg-gray-200 border-gray-300', 'To be determined'],
          ].map(([className, label]) => (
            <span className="flex items-center gap-2" key={label}>
              <span className={`h-4 w-4 border ${className}`} />
              {label}
            </span>
          ))}
        </div>
        <button
          className="flex items-center gap-2 rounded border border-gray-300 px-3 py-2 text-sm font-medium hover:border-primary hover:text-primary"
          onClick={() => setIsDetailedView((isDetailed) => !isDetailed)}
          disabled={isPathLimitExceeded || isPreparingPaths}
          type="button"
        >
          {isDetailedView ? <ZoomOut size="1.1em" /> : <ZoomIn size="1.1em" />}
          {isDetailedView ? 'Heatmap overview' : 'Magnify details'}
        </button>
      </div>

      <p className="mb-3 text-sm text-gray-600">
        {isDetailedView
          ? 'Each row is one possible path to eligibility. Hover over a colored cell to compare the patient value with all requirements for that variable.'
          : 'All eligibility paths are shown together. Hover over a numbered column or colored cell for details, or use the magnifier for the readable view.'}
      </p>

      {isPreparingPaths && paths.length > 0 && (
        <div
          className="mb-3 border border-gray-300 bg-gray-50 p-3"
          role="status"
        >
          Preparing eligibility paths… {processedPathCount.toLocaleString()} of{' '}
          {pathCount.toLocaleString()}
        </div>
      )}

      {pathCount > PATHS_PER_PAGE && !isPathLimitExceeded && !isPreparingPaths && (
        <div className="mb-3 flex items-center justify-between gap-3 text-sm">
          <span>
            Showing paths {firstVisiblePath}–{lastVisiblePath} of {pathCount}
          </span>
          <div className="flex gap-2">
            <button
              className="rounded border border-gray-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={page === 0}
              onClick={() => setPage((currentPage) => currentPage - 1)}
              type="button"
            >
              Previous
            </button>
            <button
              className="rounded border border-gray-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={page === pageCount - 1}
              onClick={() => setPage((currentPage) => currentPage + 1)}
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {isPathLimitExceeded ? (
        <div className="border border-yellow-500 bg-yellow-50 p-4" role="alert">
          This Boolean tree expands to {pathCount.toLocaleString()} eligibility
          paths. The heatmap is not rendered because that many combinations
          could make the browser unresponsive. Use the Logic tree view to
          inspect this trial.
        </div>
      ) : isPreparingPaths && paths.length === 0 ? (
        <div className="border border-gray-300 bg-gray-50 p-4" role="status">
          Preparing eligibility paths… {processedPathCount.toLocaleString()} of{' '}
          {pathCount.toLocaleString()}
        </div>
      ) : !isDetailedView ? (
        <div className="max-h-[65vh] overflow-auto border border-gray-300">
          <table className="w-full table-fixed border-collapse text-center text-xs">
            <thead className="sticky top-0 z-20 bg-white shadow-sm">
              <tr>
                <th className="sticky left-0 z-30 w-16 border-b border-r bg-white p-1">
                  Path
                </th>
                {columns.map((column, columnIndex) => (
                  <th
                    aria-label={column}
                    className="h-7 truncate border-b border-r bg-white p-0.5 font-medium"
                    key={column}
                    title={column}
                  >
                    {columnIndex + 1}
                  </th>
                ))}
                <th className="sticky right-0 z-30 w-12 border-b bg-white p-1">
                  Result
                </th>
              </tr>
            </thead>
            <tbody>
              {visiblePaths.map(
                ({ criteriaByColumn, pathIndex, pathStatus }) => {
                  return (
                    <tr key={`overview-path-${pathIndex}`}>
                      <th className="sticky left-0 z-10 h-6 border-b border-r bg-white p-1 font-medium">
                        {pathIndex + 1}
                      </th>
                      {columns.map((column) => {
                        const criteria = criteriaByColumn.get(column) ?? []

                        return criteria.length === 0 ? (
                          <td
                            className="h-6 border-b border-r bg-white p-0"
                            key={column}
                            title={`${column} is not required for path ${
                              pathIndex + 1
                            }`}
                          />
                        ) : (
                          <td
                            aria-label={getCellDetails(criteria, column)}
                            className={`h-6 border p-0 ${getStatusClasses(
                              getStatus(criteria)
                            )}`}
                            key={column}
                            title={getCellDetails(criteria, column)}
                          />
                        )
                      })}
                      <td
                        aria-label={getStatusLabel(pathStatus)}
                        className={`sticky right-0 h-6 border p-0 ${getStatusClasses(
                          pathStatus
                        )}`}
                        title={getStatusLabel(pathStatus)}
                      />
                    </tr>
                  )
                }
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="max-h-[65vh] overflow-auto border border-gray-300">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 z-20 bg-white shadow-sm">
              <tr>
                <th className="sticky left-0 z-30 min-w-[7rem] border-b border-r bg-white p-2">
                  Eligibility path
                </th>
                {columns.map((column) => (
                  <th
                    className="min-w-[10rem] max-w-[14rem] border-b border-r bg-white p-2 align-bottom"
                    key={column}
                  >
                    {column}
                  </th>
                ))}
                <th className="sticky right-0 z-30 min-w-[9rem] border-b bg-white p-2">
                  Path result
                </th>
              </tr>
            </thead>
            <tbody>
              {visiblePaths.map(
                ({ criteriaByColumn, pathIndex, pathStatus }) => {
                  return (
                    <tr key={`path-${pathIndex}`}>
                      <th className="sticky left-0 z-10 border-b border-r bg-white p-2 font-medium">
                        Path {pathIndex + 1}
                      </th>
                      {columns.map((column) => {
                        const criteria = criteriaByColumn.get(column) ?? []

                        if (criteria.length === 0) {
                          return (
                            <td
                              aria-label={`${column} is not required for path ${
                                pathIndex + 1
                              }`}
                              className="border-b border-r p-2 text-center text-gray-400"
                              key={column}
                            >
                              —
                            </td>
                          )
                        }

                        const status = getStatus(criteria)
                        const details = getCellDetails(criteria, column)

                        return (
                          <td className="border-b border-r p-1" key={column}>
                            <div
                              aria-label={details}
                              className={`min-h-[3rem] cursor-help rounded border p-2 ${getStatusClasses(
                                status
                              )}`}
                              title={details}
                            >
                              <span className="font-medium">
                                {getStatusLabel(status)}
                              </span>
                              {criteria.length > 1 && (
                                <span className="mt-1 block text-xs">
                                  {criteria.length} requirements
                                </span>
                              )}
                            </div>
                          </td>
                        )
                      })}
                      <td className="sticky right-0 border-b bg-white p-1">
                        <div
                          className={`rounded border p-2 font-medium ${getStatusClasses(
                            pathStatus
                          )}`}
                        >
                          {getStatusLabel(pathStatus)}
                        </div>
                      </td>
                    </tr>
                  )
                }
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default EligibilityMatrix
