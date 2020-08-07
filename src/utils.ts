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

  const fieldIdByName = fields.reduce(
    (acc, { id, name }) => ({ ...acc, [name]: id }),
    {} as { [name: string]: number }
  )
  const criteriaById = criteria.reduce(
    (acc, { id, ...crit }) => ({ ...acc, [id]: crit }),
    {} as { [id: number]: any }
  )
  const valueById = Object.keys(values)
    .map((name) => ({ id: fieldIdByName[name], value: values[name] }))
    .reduce(
      (acc, { id, value }) => ({ ...acc, [id]: value }),
      {} as { [id: number]: any }
    )
  const isMatch = (algorithm: MatchAlgorithm) => {
    const handler = (algoCrit: number | MatchAlgorithm) =>
      typeof algoCrit === 'number'
        ? criteriaById[algoCrit].fieldValue ===
          valueById[criteriaById[algoCrit].fieldId]
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
        (acc, { name, type, defaultValue }) => ({
          ...acc,
          [name]:
            type !== 'checkbox' && type === 'multiselect' ? [] : defaultValue,
        }),
        {} as MatchFormValues
      )
    : ({} as MatchFormValues)
