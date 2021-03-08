import {
  ComparisonOperator,
  EligibilityCriterion,
  MatchFormConfig,
  MatchFormValues,
  MatchCondition,
  MatchAlgorithm,
  MatchInfo,
  MatchInfoAlgorithm,
  MatchDetails,
  MatchFormFieldConfig,
  MatchFormFieldShowIfCondition,
} from './model'

export const getMatchIds = (matchDetails: MatchDetails) => {
  const matchIds: number[] = []
  if (Object.keys(matchDetails).length === 0) return matchIds

  const isMatch = (algorithm: MatchInfoAlgorithm): boolean => {
    const handler = (matchInfoOrAlgo: MatchInfo | MatchInfoAlgorithm) =>
      matchInfoOrAlgo.hasOwnProperty('isMatched')
        ? (matchInfoOrAlgo as MatchInfo).isMatched
        : isMatch(matchInfoOrAlgo as MatchInfoAlgorithm)

    switch (algorithm.operator) {
      case 'AND':
        return algorithm.criteria.every(handler)
      case 'OR':
        return algorithm.criteria.some(handler)
    }
  }

  for (const [studyId, studyMatchDetail] of Object.entries(matchDetails))
    if (isMatch(studyMatchDetail)) matchIds.push(parseInt(studyId))

  return matchIds
}

export const getFieldOptionLabelMap = (fields: MatchFormFieldConfig[]) => {
  if (fields === undefined) return {}

  const fieldOptionLabelMap = {} as {
    [fieldId: number]: { [optionValue: number]: string }
  }
  for (const field of fields)
    if (field.options !== undefined) {
      const optionLabels = {} as { [optionValue: number]: string }
      for (const option of field.options)
        optionLabels[option.value as number] = option.label
      fieldOptionLabelMap[field.id] = optionLabels
    }

  return fieldOptionLabelMap
}

const testCriterion = (
  critOperator: ComparisonOperator,
  critValue: any,
  testValue: any
) => {
  switch (critOperator) {
    case 'eq':
      return critValue === testValue
    case 'gt':
      return critValue < testValue
    case 'gte':
      return critValue <= testValue
    case 'lt':
      return critValue > testValue
    case 'lte':
      return critValue >= testValue
    case 'ne':
      return critValue !== testValue
  }
}

export const getMatchDetails = (
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
    return {} as MatchDetails

  const fieldOptionLabelMap = getFieldOptionLabelMap(fields)

  const getMatchInfo = (critId: number) => {
    for (const crit of criteria)
      if (crit.id === critId)
        for (const field of fields)
          if (field.id === crit.fieldId)
            return {
              fieldName: field.label || field.name,
              fieldValue: crit.fieldValue,
              isMatched:
                values[crit.fieldId] === undefined
                  ? undefined
                  : testCriterion(
                      crit.operator,
                      crit.fieldValue,
                      values[crit.fieldId]
                    ),
              fieldValueLabel:
                fieldOptionLabelMap?.[field.id]?.[crit.fieldValue],
              operator: crit.operator,
            }

    return {} as MatchInfo
  }

  const parseAlgorithm = (algorithm: MatchAlgorithm): MatchInfoAlgorithm => ({
    operator: algorithm.operator,
    criteria: algorithm.criteria.map((critIdOrAlgo) =>
      typeof critIdOrAlgo === 'number'
        ? getMatchInfo(critIdOrAlgo)
        : parseAlgorithm(critIdOrAlgo)
    ),
  })

  const matchDetails = {} as MatchDetails
  for (const { studyId, algorithm } of matchConditions)
    matchDetails[studyId] = parseAlgorithm(algorithm)

  return matchDetails
}

export const getDefaultValues = ({ fields }: MatchFormConfig) => {
  const defaultValues = {} as MatchFormValues
  if (fields === undefined) return defaultValues

  for (const { id, type, defaultValue } of fields)
    defaultValues[id] =
      type !== 'checkbox' && type === 'multiselect' ? [] : defaultValue

  return defaultValues
}

export const getIsFieldShowing = (
  { criteria, operator }: MatchFormFieldShowIfCondition,
  fields: MatchFormFieldConfig[],
  values: { [x: string]: any }
) => {
  let isShowing = true

  showIfCritLoop: for (const crit of criteria)
    for (const field of fields)
      if (crit.id === field.id) {
        isShowing = testCriterion(crit.operator, crit.value, values[field.id])

        if (
          (operator === 'AND' && !isShowing) ||
          (operator === 'OR' && isShowing)
        )
          break showIfCritLoop
      }

  return isShowing
}

export const clearShowIfField = (
  { fields }: MatchFormConfig,
  defaultValues: MatchFormValues,
  values: MatchFormValues
) => {
  for (const { id, showIf } of fields)
    if (showIf !== undefined && !getIsFieldShowing(showIf, fields, values))
      values[id] = defaultValues[id]

  return values
}

export const initFenceOAuth = () => {
  const fenceUrl = process.env.REACT_APP_FENCE_URL
  const params = [
    ['client_id', process.env.REACT_APP_FENCE_CLIENT_ID as string],
    ['response_type', 'code'],
    ['redirect_uri', window.location.origin],
    ['scope', 'openid'],
  ]
  window.location.href = `${fenceUrl}/oauth2/authorize?${params
    .map(([key, value]) => `${key}=${value}`)
    .join('&')}`
}

export const fetchFenceAccessToken = (code: string) => {
  const fenceUrl = process.env.REACT_APP_FENCE_URL
  const body = new FormData()
  const params = [
    ['grant_type', 'authorization_code'],
    ['redirect_uri', window.location.origin],
    ['code', code],
    ['client_id', process.env.REACT_APP_FENCE_CLIENT_ID as string],
  ]
  for (const [key, value] of params) body.append(key, value)

  return fetch(`${fenceUrl}/oauth2/token`, { method: 'POST', body })
    .then((response) => response.json())
    .then(({ access_token }) => access_token)
}
