import {
  EligibilityCriterion,
  MatchFormConfig,
  MatchFormValues,
  MatchCondition,
  MatchAlgorithm,
  MatchInfo,
  MatchInfoAlgorithm,
  MatchDetails,
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

export const getMatchDetails = (
  criteria: EligibilityCriterion[],
  matchConditions: MatchCondition[],
  { fields }: MatchFormConfig,
  values: MatchFormValues
) => {
  const getIsMatched = (
    crit: EligibilityCriterion,
    values: MatchFormValues
  ) => {
    switch (crit.operator) {
      case 'eq':
        return crit.fieldValue === values[crit.fieldId]
      case 'gt':
        return crit.fieldValue < values[crit.fieldId]
      case 'gte':
        return crit.fieldValue <= values[crit.fieldId]
      case 'lt':
        return crit.fieldValue > values[crit.fieldId]
      case 'lte':
        return crit.fieldValue >= values[crit.fieldId]
      case 'ne':
        return crit.fieldValue !== values[crit.fieldId]
    }
  }

  const getMatchInfo = (critId: number) => {
    for (const crit of criteria)
      if (crit.id === critId)
        for (const field of fields)
          if (field.id === crit.fieldId)
            return {
              fieldName: field.label || field.name,
              fieldValue: crit.fieldValue,
              isMatched: getIsMatched(crit, values),
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

export const clearShowIfField = (
  { fields }: MatchFormConfig,
  defaultValues: MatchFormValues,
  values: MatchFormValues
) => {
  const showIfFieldsById: {
    [id: number]: { id: number; showIfValue: any }[]
  } = {}
  for (const field of fields) {
    const showIfFields: { id: number; showIfValue: any }[] = []
    for (const { id, showIf } of fields)
      if (showIf !== undefined && showIf.id === field.id)
        showIfFields.push({ id, showIfValue: showIf.value })
    if (showIfFields.length > 0) showIfFieldsById[field.id] = showIfFields
  }

  for (const field of fields) {
    const showIfFields = showIfFieldsById[field.id]
    if (showIfFields !== undefined)
      for (const { id, showIfValue } of showIfFields)
        if (showIfValue !== values[field.id]) values[id] = defaultValues[id]
  }

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
