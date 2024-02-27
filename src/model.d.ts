export type ApiStatus = 'not started' | 'sending' | 'success' | 'error'
type Site = {
  id: number
  active: boolean
  name: string
}

export type Study = {
  id: number
  code: string
  name: string
  description: string
  links: { name: string; href: string }[]
  sites: Site[]
  follow_up_info: string | null
}

export type StudyVersion = {
  id: number
  study_version: number
  eligibility_criteria_infos: [
    {
      study_algorithm_engine_id: number | null
      eligibility_criteria_id: number
      status: StudyVersionStatus
    }
  ]
  study: Study
}

export type StudyVersionStatus = 'ACTIVE' | 'IN_PROCESS' | 'INACTIVE'

type ComparisonOperator = 'eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'ne' | 'in'

export type EligibilityCriterion = {
  id: number
  fieldId: number
  fieldValue: any
  operator: ComparisonOperator
}

export type MatchAlgorithm = {
  operator: 'AND' | 'OR'
  criteria: (EligibilityCriterion['id'] | MatchAlgorithm)[]
}

export type MatchCondition = {
  studyId: Study['id']
  algorithm: MatchAlgorithm
}

export type StudyAlgorithmEngine = {
  id: number
  algorithm_logic: MatchAlgorithm
}

export type MatchFormGroupConfig = {
  id: number
  name: string
}

export type MatchFormFieldOption = {
  value: any
  label: string
  description?: string
}

export type MatchFormFieldConfig = {
  id: number
  groupId: number
  type:
    | 'text'
    | 'age'
    | 'number'
    | 'checkbox'
    | 'radio'
    | 'multiselect'
    | 'select'
  name: string
  label?: string
  options?: MatchFormFieldOption[]
  defaultValue?: any
  showIf?: {
    operator: 'AND' | 'OR'
    criteria: {
      id: MatchFormFieldConfig['id']
      operator: ComparisonOperator
      value: any
      is_numeric?: boolean
      unit?: string
      valueId?: number | null
    }[]
  }
  relevant?: boolean
  [key: string]: any
}

export type MatchFormFieldShowIfCondition = NonNullable<
  MatchFormFieldConfig['showIf']
>

export type MatchFormConfig = {
  groups: MatchFormGroupConfig[]
  fields: MatchFormFieldConfig[]
}

export type MatchFormValues = {
  [fieldId: MatchFormFieldConfig['id']]: any
}

export type MatchInfo = {
  fieldName: string
  fieldValue: any
  fieldValueLabel?: string | string[]
  isMatched?: boolean
  operator: ComparisonOperator
}

export type MatchInfoAlgorithm = {
  operator: 'AND' | 'OR'
  criteria: (MatchInfo | MatchInfoAlgorithm)[]
  isMatched?: boolean
}

export type MatchDetails = {
  [studyId: Study['id']]: MatchInfoAlgorithm
}

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
  type: MatchFormFieldConfig['type']
  name: string
  label?: string | React.ReactNode
  options?: { value: string; label: string }[]
  showIf?: { name: string; value: any }
  [key: string]: any
}

export type RegisterInput = {
  firstName: string
  lastName: string
  institution: string
  role: string
  roleOther?: string
  reviewStatus: {
    [documentId: RegisterDocument['id']]: boolean
  }
  accessCode?: string
}

export type UserData = {
  authz: {
    [path: string]: {
      method: string
      service: string
    }[]
  }
  docs_to_be_reviewed: RegisterDocument[]
  username: string
  is_admin: boolean
  sub: string
  [key: string]: any
}

export type UserInput = {
  id?: number
  results: { id: string; value: string }[]
}

export type EligibilityCriteriaInfo = {
  create_date?: string
  status: StudyVersionStatus
  study_version_id?: number
  study_algorithm_engine_id?: number
  eligibility_criteria_id?: number
  id?: number
}

export type Unit = {
  id: number
  name: string
}
