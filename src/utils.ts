import type {
  ComparisonOperator,
  EligibilityCriterion,
  MatchAlgorithm,
  MatchCondition,
  MatchDetails,
  MatchFormConfig,
  MatchFormFieldConfig,
  MatchFormFieldShowIfCondition,
  MatchFormValues,
  MatchInfo,
  MatchInfoAlgorithm,
  Study,
} from './model'
import {
  BasicConfig,
  Config,
  Fields,
  JsonGroup,
  JsonItem,
  JsonRule,
  Utils as QbUtils,
} from '@react-awesome-query-builder/ui'

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
    case 'in':
      return critValue.includes(testValue)
  }
}

const mergeStatus = (
  operator: 'AND' | 'OR',
  hasStatus: { [k in 'true' | 'undefined' | 'false']: boolean }
) => {
  switch (operator) {
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

const isMatchAlgorithm = (matchInfoOrAlgo: MatchInfo | MatchInfoAlgorithm) => {
  return Object.prototype.hasOwnProperty.call(matchInfoOrAlgo, 'criteria')
}

const addMatchStatusSimple = (simpleAlgorithm: {
  operator: 'AND' | 'OR'
  criteria: MatchInfo[]
}): MatchInfoAlgorithm => {
  const hasStatus = { true: false, undefined: false, false: false }
  for (const { isMatched } of simpleAlgorithm.criteria)
    hasStatus[String(isMatched) as 'true' | 'undefined' | 'false'] = true

  return {
    ...simpleAlgorithm,
    isMatched: mergeStatus(simpleAlgorithm.operator, hasStatus),
  }
}

export const addMatchStatus = (
  algorithm: MatchInfoAlgorithm
): MatchInfoAlgorithm => {
  const criteria = []
  const hasStatus = { true: false, undefined: false, false: false }
  for (const matchInfoOrAlgo of algorithm.criteria) {
    const crit = isMatchAlgorithm(matchInfoOrAlgo)
      ? algorithm.criteria.some(isMatchAlgorithm)
        ? addMatchStatus(matchInfoOrAlgo as MatchInfoAlgorithm)
        : addMatchStatusSimple(
            matchInfoOrAlgo as {
              operator: 'AND' | 'OR'
              criteria: MatchInfo[]
            }
          )
      : matchInfoOrAlgo

    criteria.push(crit)
    hasStatus[String(crit.isMatched) as 'true' | 'undefined' | 'false'] = true
  }

  return {
    operator: algorithm.operator,
    criteria,
    isMatched: mergeStatus(algorithm.operator, hasStatus),
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
        values[crit.fieldId] === undefined ||
        values[crit.fieldId] === '' ||
        fieldOptionLabelMap[field.id]?.[values[crit.fieldId]] === 'Not sure'
          ? undefined
          : testCriterion(crit.operator, crit.fieldValue, values[crit.fieldId]),
      fieldValueLabel: Array.isArray(crit.fieldValue)
        ? crit.fieldValue.map((v) => fieldOptionLabelMap[field.id]?.[v])
        : fieldOptionLabelMap[field.id]?.[crit.fieldValue],
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
    matchDetails[studyId] = addMatchStatus(parseAlgorithm(algorithm))

  return matchDetails
}

export const getMatchGroups = (matchDetails: MatchDetails) => {
  const matched: number[] = []
  const undetermined: number[] = []
  const unmatched: number[] = []
  for (const [studyId, studyMatchDetail] of Object.entries(matchDetails))
    switch (studyMatchDetail.isMatched) {
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
  config: MatchFormConfig,
  values: { [x: string]: any }
) => {
  let isShowing = true

  showIfCritLoop: for (const crit of criteria)
    for (const field of config.fields)
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
  config: MatchFormConfig,
  values: MatchFormValues
) => {
  const defaultValues = getDefaultValues(config)
  for (const { id, showIf } of config.fields)
    if (showIf !== undefined && !getIsFieldShowing(showIf, config, values))
      values[id] = defaultValues[id]

  return values
}

export const getUniqueCritIdsInAlgorithm = (algorithm: MatchAlgorithm) => {
  const criteria: number[] = []
  for (const value of algorithm.criteria)
    if (typeof value === 'number') criteria.push(value)
    else criteria.push(...getUniqueCritIdsInAlgorithm(value))

  return [...new Set(criteria)]
}

type markRelevantMatchFieldsArgs = {
  conditions: MatchCondition[]
  criteria: EligibilityCriterion[]
  fields: MatchFormFieldConfig[]
  unmatched: number[]
  values: MatchFormValues
  studies: Study[]
}
export const markRelevantMatchFields = ({
  conditions,
  criteria,
  fields,
  unmatched,
  values,
  studies,
}: markRelevantMatchFieldsArgs) => {
  // list of studies listed as options
  const studyIdSet: Set<number> = new Set()
  for (const { id } of studies) studyIdSet.add(id)

  // comment this otherwise it will miss excluding the questions for study that have not been loaded
  // if (unmatched?.length === 0)
  //   return fields.map((field) => ({ ...field, relevant: true }))

  const unmatchedStudyIdSet = new Set(unmatched)

  const relevantCritIdSet: Set<number> = new Set()
  for (const { algorithm, studyId } of conditions)
    if (!unmatchedStudyIdSet.has(studyId) && studyIdSet.has(studyId)) {
      const uniqueCritIds = getUniqueCritIdsInAlgorithm(algorithm)
      for (const id of uniqueCritIds) relevantCritIdSet.add(id)
    }

  const relevantFieldIdSet: Set<number> = new Set()
  for (const { id, fieldId } of criteria)
    if (relevantCritIdSet.has(id) || values[fieldId] !== undefined)
      relevantFieldIdSet.add(fieldId)

  const markedFields: MatchFormFieldConfig[] = []
  for (const field of fields)
    markedFields.push({ ...field, relevant: relevantFieldIdSet.has(field.id) })

  return markedFields
}

export const initialQueryBuilderConfig: Config = {
  ...BasicConfig,
  fields: {},
}

export const getQueryBuilderConfig = (
  matchFormFields: MatchFormFieldConfig[],
  criteria: EligibilityCriterion[]
): Config => ({
  ...initialQueryBuilderConfig,
  settings: {
    ...initialQueryBuilderConfig.settings,
    immutableValuesMode: true,
    immutableOpsMode: true,
    showNot: false,
  },
  fields: getQueryBuilderField(matchFormFields, criteria),
})

function getQueryBuilderField(
  matchingFormFields: MatchFormFieldConfig[],
  criteria: EligibilityCriterion[]
): Fields {
  const result: Fields = {}

  criteria.forEach((c) => {
    const { id, fieldId, fieldValue, operator } = c
    const field = matchingFormFields.find((f) => f.id === fieldId)

    if (field) {
      const isSelect = !!field.options?.length
      result[id.toString(10)] = {
        label: `${field.name} ${getOperatorString(operator)} ${getValueString(
          fieldValue,
          field
        )}`,
        type: isSelect ? 'select' : 'number',
        defaultOperator: getQueryBuilderOperator(operator, isSelect),
        defaultValue: fieldValue,
        fieldSettings: isSelect
          ? {
              listValues: field.options?.map((o) => ({
                value: o.value,
                title: o.label,
              })),
            }
          : { min: 0 },
      }
    }
  })

  return result
}

export const getInitQueryValue = (): JsonGroup => ({
  id: QbUtils.uuid(),
  type: 'group',
})

export function getQueryBuilderValue(
  algorithm: MatchAlgorithm | undefined | null,
  eligibilityCriteria: EligibilityCriterion[],
  matchForm: MatchFormConfig
): JsonGroup {
  const result = getInitQueryValue()
  if (!algorithm) {
    return result
  }
  const children1 = algorithm.criteria
    .map((c) => {
      if (typeof c === 'number') {
        const studyCriterion = eligibilityCriteria.find((ec) => ec.id === c)
        return studyCriterion
          ? getQueryBuilderRule(studyCriterion, matchForm)
          : null
      } else {
        return getQueryBuilderValue(c, eligibilityCriteria, matchForm)
      }
    })
    .filter(Boolean) as JsonItem[]
  return {
    ...result,
    properties: {
      conjunction: algorithm.operator,
    },
    children1,
  }
}

export function queryBuilderValueToAlgorithm(
  queryBuilderValue: JsonGroup
): MatchAlgorithm {
  const children = queryBuilderValue.children1

  const criteria =
    children && Array.isArray(children)
      ? children
          .map((c) => {
            if (c.type === 'rule') {
              const criteriaId = parseInt(c.properties.field || '', 10)
              return isNaN(criteriaId) ? 0 : criteriaId
            }
            return queryBuilderValueToAlgorithm(c as JsonGroup)
          })
          .filter(Boolean)
      : []
  return {
    operator: (queryBuilderValue.properties?.conjunction || 'AND') as
      | 'AND'
      | 'OR',
    criteria,
  }
}

function getQueryBuilderRule(
  { id, fieldId, fieldValue, operator }: EligibilityCriterion,
  { fields }: MatchFormConfig
): JsonRule | null {
  const field = fields.find((f) => f.id === fieldId)
  if (!field) {
    return null
  }
  const isSelect = !!field.options?.length
  return {
    id: QbUtils.uuid(),
    type: 'rule',
    properties: {
      field: id.toString(10),
      value: [fieldValue],
      operator: getQueryBuilderOperator(operator, isSelect),
      valueSrc: ['value'],
      valueType: [isSelect ? 'select' : 'number'],
    },
  }
}

function getQueryBuilderOperator(
  comparisonOperator: ComparisonOperator,
  isSelect: boolean
): string {
  switch (comparisonOperator) {
    case 'gte':
      return 'greater_or_equal'
    case 'in':
      return 'select_any_in'
    case 'gt':
      return 'greater'
    case 'lte':
      return 'less_or_equal'
    case 'lt':
      return 'less'
    case 'eq':
      return isSelect ? 'select_equals' : 'equal'
    case 'ne':
      return isSelect ? 'select_not_equals' : 'not_equal'
  }
}

function getOperatorString(comparisonOperator: ComparisonOperator): string {
  switch (comparisonOperator) {
    case 'gte':
      return '>='
    case 'in':
      return 'in'
    case 'gt':
      return '>'
    case 'lte':
      return '<='
    case 'lt':
      return '<'
    case 'eq':
      return '=='
    case 'ne':
      return '!='
  }
}

function getValueString(fieldValue: any, field: MatchFormFieldConfig): string {
  if (field.options?.length) {
    return field.options.find((o) => o.value === fieldValue)?.label || ''
  }
  return fieldValue
}

export function getShowIfDetails(
  fields: MatchFormFieldConfig[],
  showIf: MatchFormFieldShowIfCondition
): MatchInfoAlgorithm {
  const fieldOptionLabelMap = getFieldOptionLabelMap(fields)
  return {
    operator: showIf.operator || 'AND',
    criteria: showIf.criteria.map((c) => {
      const field = fields.find((f) => f.id === c.id)
      const fieldValueLabel = Array.isArray(c.value)
        ? c.value.map((v) => fieldOptionLabelMap[c.id]?.[v])
        : fieldOptionLabelMap[c.id]?.[c.value]
      return {
        fieldName: field?.label || field?.name || '',
        fieldValue: c.value,
        operator: c.operator,
        fieldValueLabel,
      }
    }),
  }
}
