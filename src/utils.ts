import {
  EligibilityCriterion,
  MatchFormConfig,
  MatchFormValues,
  MatchCondition,
  MatchAlgorithm,
} from './model'

export const getMatchIds = (
  criteria: EligibilityCriterion[],
  matchConditions: MatchCondition[],
  { fields }: MatchFormConfig,
  values: MatchFormValues
) => {
  if (
    criteria.length === 0 ||
    matchConditions.length === 0 ||
    fields === undefined
  )
    return []

  const criteriaById = criteria.reduce(
    (acc, { id, ...crit }) => ({ ...acc, [id]: crit }),
    {} as { [id: number]: { fieldId: number; fieldValue: any } }
  )
  const isMatch = (algorithm: MatchAlgorithm) => {
    const handler = (algoCrit: number | MatchAlgorithm) =>
      typeof algoCrit === 'number'
        ? criteriaById[algoCrit].fieldValue ===
          values[criteriaById[algoCrit].fieldId]
        : isMatch(algoCrit)

    let result
    switch (algorithm.operator) {
      case 'AND':
        result = algorithm.criteria.every(handler)
        break
      case 'OR':
        result = algorithm.criteria.some(handler)
    }

    return result
  }

  return matchConditions
    .filter(({ algorithm }) => isMatch(algorithm))
    .map(({ studyId }) => studyId)
}

export const getDefaultValues = ({ fields }: MatchFormConfig) =>
  fields
    ? fields.reduce(
        (acc, { id, type, defaultValue }) => ({
          ...acc,
          [id]:
            type !== 'checkbox' && type === 'multiselect' ? [] : defaultValue,
        }),
        {} as MatchFormValues
      )
    : ({} as MatchFormValues)
