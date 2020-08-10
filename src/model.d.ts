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
}

export type MatchAlgorithm = {
  operator: string
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

export type MatchFormFieldConfig = {
  id: number
  groupId: number
  type: string
  name: string
  label?: string
  options?: string[]
  defaultValue?: any
  showIf?: { id: number; value: any }
  [key: string]: any
}

export type MatchFormConfig = {
  groups: MatchFormGroupConfig[]
  fields: MatchFormFieldConfig[]
}

export type MatchFormValues = {
  [id: number]: any
}
