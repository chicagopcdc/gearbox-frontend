import type {
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
  RegisterUserInput,
  UserData,
} from './model'

export const getMatchGroups = (matchDetails: MatchDetails) => {
  const getMatchStatus = (algorithm: MatchInfoAlgorithm) => {
    const hasStatus = { true: false, undefined: false, false: false }
    for (const matchInfoOrAlgo of algorithm.criteria) {
      const matchStatus = Object.prototype.hasOwnProperty.call(
        matchInfoOrAlgo,
        'isMatched'
      )
        ? (matchInfoOrAlgo as MatchInfo).isMatched
        : getMatchStatus(matchInfoOrAlgo as MatchInfoAlgorithm)

      hasStatus[String(matchStatus) as 'true' | 'undefined' | 'false'] = true
    }

    switch (algorithm.operator) {
      case 'AND':
        if (hasStatus.false) return false
        if (hasStatus.undefined) return undefined
        return true
      case 'OR':
        if (hasStatus.true) return true
        if (hasStatus.undefined) return undefined
        return false
    }
  }

  const matched: number[] = []
  const undetermined: number[] = []
  const unmatched: number[] = []
  for (const [studyId, studyMatchDetail] of Object.entries(matchDetails))
    switch (getMatchStatus(studyMatchDetail)) {
      case true:
        matched.push(parseInt(studyId))
        break
      case undefined:
        undetermined.push(parseInt(studyId))
        break
      case false:
        unmatched.push(parseInt(studyId))
    }

  return { matched, undetermined, unmatched }
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

  const critById: { [id: number]: EligibilityCriterion } = {}
  for (const crit of criteria) critById[crit.id] = crit

  const fieldById: { [id: number]: MatchFormFieldConfig } = {}
  for (const field of fields) fieldById[field.id] = field

  const fieldOptionLabelMap = getFieldOptionLabelMap(fields)

  const getMatchInfo = (critId: number) => {
    const crit = critById[critId]
    if (crit === undefined) return {} as MatchInfo

    const field = fieldById[crit.fieldId]
    if (field === undefined) return {} as MatchInfo

    return {
      fieldName: field.label || field.name,
      fieldValue: crit.fieldValue,
      isMatched:
        values[crit.fieldId] === undefined || values[crit.fieldId] === ''
          ? undefined
          : testCriterion(crit.operator, crit.fieldValue, values[crit.fieldId]),
      fieldValueLabel: fieldOptionLabelMap?.[field.id]?.[crit.fieldValue],
      operator: crit.operator,
    }
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

export function handleFenceLogout() {
  window.location.assign(`/user/logout?next=${window.location.href}`)
}

export function handleGoogleLogin() {
  window.location.assign(`/user/login/google?redirect=${window.location.href}`)
}

export function fetchUserData() {
  return fetch('/user/user/').then((res) => {
    if (!res.ok) throw new Error('Error: Failed to fetch user information!')
    return res.json() as Promise<UserData>
  })
}

export async function registerUser({
  reviewStatus,
  ...userInformation
}: RegisterUserInput) {
  const userResponse = await fetch('/user/user', {
    body: JSON.stringify(userInformation),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  })
  if (!userResponse.ok) throw new Error('Failed to update user information.')

  if (Object.values(reviewStatus).filter(Boolean).length > 0) {
    const documentsResponse = await fetch('/user/user/documents', {
      body: JSON.stringify(reviewStatus),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    if (!documentsResponse.ok)
      throw new Error('Failed to update document review status.')
  }
}
