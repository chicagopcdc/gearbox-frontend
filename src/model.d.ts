export type ApiStatus = 'not started' | 'sending' | 'success' | 'error'
type Site = {
  name: string
  country: string | null
  city: strin | null
  state: string | null
  zip: string | null
  create_date: string | null
  location_lat: string | null
  location_long: string | null
  id: number
}

export type Study = {
  id: number
  code: string
  name: string
  create_date: string | null
  active: boolean
  description: string
  links: { name: string; href: string }[]
  sites: Site[]
  follow_up_info: string | null
}

export type StudyVersion = {
  id: number
  study_version: number
  status: StudyVersionStatus
  eligibility_criteria_id: number
  study_algorithm_engine_id: number | null
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
  study_version_id: number
  algorithm_logic: MatchAlgorithm
}

export type MatchFormGroupConfig = {
  id: number
  name: string
}

//Add
export type ImportantQuestionGroupConfig = {
  id: number
  name: string
}

//Add
export type ImportantQuestionConfig = {
  groups: ImportantQuestionGroupConfig[]
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
export type MatchGroups = {
  [group in 'matched' | 'undetermined' | 'unmatched']: number[]
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

export type UserInputApi = {
  id?: number
  results: { id: string; value: string }[]
  name?: string | null
}

export type UserInputUi = {
  values: MatchFormValues
  id?: number
  name?: string
}

export type ElCriteriaHasCriterion = {
  criterion_id: number | null
  eligibility_criteria_id: number
  create_date?: string
  active: boolean
}

export type StagingElCriteriaHasCriterion = ElCriteriaHasCriterion & {
  criterion_staging_id: number
  value_ids: number[]
}

export type InputType = {
  id: number
  data_type: 'Integer' | 'list' | 'percentage' | 'Float' | 'integer'
  render_type: 'number' | 'radio' | 'select' | 'age'
}

export type StudyVersionAdjudication = {
  study_id: number
  study_version_num: number
  id: number
  active: boolean
  eligibility_criteria_id: number
  study_algorithm_engine_id: number
  study: Study
}

export type Criterion = {
  id: number
  code: string
  description: string
  display_name: string
  input_type_id: number
  values: CriteriaValue[]
}

export type CriterionStaging = {
  code: string
  criterion_adjudication_status: 'NEW' | 'EXISTING' | 'ACTIVE' | 'IN_PROCESS'
  criterion_id: number | null
  description: string
  display_name: string
  echc_adjudication_status: 'NEW' | 'EXISTING' | 'ACTIVE'
  eligibility_criteria_id: number
  id: number
  text: string
  input_id: number
  input_type_id: number
  echc_value_ids: number[] | null
}

export type CriteriaValue = {
  id: number
  description: string | null
  is_numeric: boolean
  active: boolean
  value_string: string | null
  operator: ComparisonOperator | null
  unit_name: string | null
  unit_id: number
}

export type CriterionStagingWithValues = CriterionStaging & {
  criterion_value_ids: number[]
}

export type CriterionStagingWithValueList = CriterionStaging & {
  criterion_value_list: CriteriaValue[] | null
}

export type CriterionStagingPublish = {
  code: string
  display_name: string
  description: string
  active: boolean
  ontology_code_id?: number | null
  input_type_id: number
  criterion_staging_id: number
  values: number[]
}

export type Unit = {
  id: number
  name: string
}

export type PreAnnotatedItem = {
  span: [number, number, string]
  matched_models: string[]
  is_standard_gb_var: boolean
}

export type EntityItem = {
  id: number
  label: string
  start_offset: number
  end_offset: number
  meta: unknown
}

export type AnnotationSource = 'entity' | 'pre'
export type RawCriterion = {
  text: string
  id: number
  uuid: string | null
  nct: string | null
  pre_annotated: PreAnnotatedItem[] | null
  entities: EntityItem[] | null

  // Present in your payload; keep them typed so parsing is lossless
  Comments: unknown[]
  relations: unknown[]
}

export type HighlightSpan = {
  start: number
  end: number
  label?: string
  source: AnnotationSource
}
