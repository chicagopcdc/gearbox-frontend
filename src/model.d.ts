export type Study = {
  id: number
  title: string
  description: string
  locations: string[]
  links: { name: string; href: string }[]
}

type ComparisonOperator = 'eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'ne'

export type EligibilityCriterion = {
  id: number
  fieldId: number
  fieldValue: any
  operator: ComparisonOperator
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
  operator: ComparisonOperator
  value: any
}

export type MatchFormFieldShowIfCondition = {
  operator: 'AND' | 'OR'
  criteria: MatchFormFieldShowIfCriterion[]
}

export type MatchFormFieldOption = {
  value: any
  label: string
  description?: string
}

export type MatchFormFieldConfig = {
  id: number
  groupId: number
  type: string
  name: string
  label?: string
  options?: MatchFormFieldOption[]
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
  fieldValueLabel?: string
  isMatched?: boolean
  operator: ComparisonOperator
}

export type MatchInfoAlgorithm = {
  operator: 'AND' | 'OR'
  criteria: (MatchInfo | MatchInfoAlgorithm)[]
}

export type MatchDetails = { [id: number]: MatchInfoAlgorithm }

export type RegisterDocument = {
  formatted: string
  id: number
  name: string
  required: boolean
  raw?: string
  type?: string
  version?: number
}

export type RegisterFormFieldConfig = {
  type: string
  name: string
  label?: string | React.ReactNode
  options?: { value: string; label: string }[]
  showIf?: { name: string; value: any }
  [key: string]: any
}

export type RegisterUserInput = {
  firstName: string
  lastName: string
  institution: string
  role: string
  roleOther?: string
  reviewStatus: {
    [id: number]: boolean
  }
}

type UserData = {
  authz: {
    [path: string]: {
      method: string
      service: string
    }[]
  }
  docs_to_be_reviewed: RegisterDocument[]
  username: string
  [key: string]: any
}
