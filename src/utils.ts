import type {
  ComparisonOperator,
  EligibilityCriterion,
  MatchAlgorithm,
  MatchCondition,
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
import { buildEligibilityCriteria } from './api/eligibilityCriteria'
import { buildMatchConditions } from './api/matchConditions'
import { buildStudies } from './api/studies'

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
          ? getQueryBuilderRule(studyCriterion, matchForm.fields)
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
            if (c.type === 'rule' && typeof c.properties.field === 'string') {
              const criteriaId = parseInt(c.properties.field, 10)
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
  fields: MatchFormFieldConfig[]
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

function getComparisonOperator(operator: string): ComparisonOperator {
  switch (operator) {
    case 'greater_or_equal':
      return 'gte'
    case 'select_any_in':
      return 'in'
    case 'greater':
      return 'gt'
    case 'less_or_equal':
      return 'lte'
    case 'less':
      return 'lt'
    case 'select_not_equals':
    case 'not_equal':
      return 'ne'
    default:
      return 'eq'
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

function getCriteriaBuilderFieldType(
  type: MatchFormFieldConfig['type']
): string {
  switch (type) {
    case 'radio':
    case 'select':
      return 'select'
    case 'multiselect':
    case 'checkbox':
      return 'multiselect'
    case 'age':
    case 'number':
      return 'number'
    case 'text':
      return 'text'
  }
}

function getCriteriaBuilderFieldOperator(
  type: MatchFormFieldConfig['type']
): string[] {
  switch (type) {
    case 'radio':
    case 'select':
      return ['select_equals', 'select_not_equals']
    case 'multiselect':
    case 'checkbox':
      return ['select_any_in']
    case 'age':
    case 'number':
      return [
        'equal',
        'not_equal',
        'greater',
        'less',
        'greater_or_equal',
        'less_or_equal',
      ]
    case 'text':
      return ['equal', 'not_equal']
  }
}

export function getShowIfFields(
  matchingFormFields: MatchFormFieldConfig[]
): Fields {
  const result: Fields = {}

  matchingFormFields.forEach((f) => {
    const isSelect = !!f.options?.length
    const unitTextMatch = f.label?.match(/\(in\s(.+?)\)/)
    const unitText = unitTextMatch ? unitTextMatch[0] : ''

    result[f.id] = {
      label: `${f.name} ${unitText}`,
      type: getCriteriaBuilderFieldType(f.type),
      operators: getCriteriaBuilderFieldOperator(f.type),
      valueSources: ['value'],
      fieldSettings: isSelect
        ? {
            listValues: f.options?.map((o) => ({
              value: o.value,
              title: o.label,
            })),
          }
        : { min: 0 },
    }
  })

  return result
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

export function getShowIfInitValue(
  { operator, criteria }: MatchFormFieldShowIfCondition,
  fields: MatchFormFieldConfig[]
): JsonGroup {
  const result: JsonGroup = getInitQueryValue()
  const children1: JsonRule[] = criteria
    .map((c) =>
      getQueryBuilderRule(
        {
          id: c.id,
          fieldId: c.id,
          fieldValue: c.value,
          operator: c.operator,
        },
        fields
      )
    )
    .filter(Boolean) as JsonRule[]
  return {
    ...result,
    properties: {
      conjunction: operator,
    },
    children1,
  }
}

export function jsonGroupToShowIf(
  jsonGroup: JsonGroup,
  matchFormFields: MatchFormFieldConfig[]
): MatchFormFieldShowIfCondition | undefined {
  const children1 = jsonGroup.children1 as JsonRule[]
  const criteria = children1
    .filter(
      (c) =>
        c.properties.field &&
        c.properties.operator &&
        c.properties.value.filter(Boolean).length
    )
    .map((c) => {
      const id = parseInt(c.properties.field as string)
      const field = matchFormFields.find((f) => f.id === id)
      const isNumeric = field?.type === 'number' || field?.type === 'age'
      const unitTextMatch = field?.label?.match(/\(in\s(.+?)\)/)
      const unit = unitTextMatch ? unitTextMatch[1] : 'none'
      return {
        id,
        operator: getComparisonOperator(c.properties.operator as string),
        value: c.properties.value[0].toString(),
        is_numeric: isNumeric,
        unit,
        valueId: field?.options?.length ? c.properties.value[0] : undefined,
      }
    })
  return criteria.length
    ? {
        operator: (jsonGroup.properties?.conjunction || 'AND') as 'AND' | 'OR',
        criteria,
      }
    : undefined
}

export function publishMatchForm() {
  return Promise.all([
    buildEligibilityCriteria(),
    buildMatchConditions(),
    buildStudies(),
  ])
}
