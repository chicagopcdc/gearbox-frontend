export type Study = {
  id: number
  title: string
  group: string
  location: string
  registerLinks: { name: string; url: string }[]
}

export type EligibilityCriterion = {
  id: number
  fieldId: number
  fieldValue: any
  operator: 'eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'ne'
}

export type MatchAlgorithm = {
  operator: 'AND' | 'OR'
  criteria: (number | MatchAlgorithm)[]
}

export type MatchCondition = {
  studyId: number
  algorithm: MatchAlgorithm
}

export type MatchFormGroupConfig = {
  id: number
  name: string
}

export type MatchFormFieldShowIfCriterion = {
  id: number
  operator: 'eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'ne'
  value: any
}

export type MatchFormFieldShowIfCondition = {
  operator: 'AND' | 'OR'
  criteria: MatchFormFieldShowIfCriterion[]
}

export type MatchFormFieldConfig = {
  id: number
  groupId: number
  type: string
  name: string
  label?: string
  options?: string[]
  defaultValue?: any
  showIf?: MatchFormFieldShowIfCondition
  [key: string]: any
}

export type MatchFormConfig = {
  groups: MatchFormGroupConfig[]
  fields: MatchFormFieldConfig[]
}

export type MatchFormValues = {
  [id: number]: any
}

export type MatchInfo = {
  fieldName: string
  fieldValue: any
  isMatched: boolean
  operator: 'eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'ne'
}

export type MatchInfoAlgorithm = {
  operator: 'AND' | 'OR'
  criteria: (MatchInfo | MatchInfoAlgorithm)[]
}

export type MatchDetails = { [id: number]: MatchInfoAlgorithm }
