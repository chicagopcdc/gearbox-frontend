export type Trial = {
  id: string
  title: string
  group: string
  location: string
  registerLinks: { name: string; url: string }[]
  condition?: { [key: string]: any }
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
  [key: string]: any
}

export type MatchFormConfig = {
  groups: MatchFormGroupConfig[]
  fields: MatchFormFieldConfig[]
}

export type MatchFormValues = {
  [key: string]: any
}

export type MatchResult = {
  isLoaded: boolean
  isError: boolean
  ids: string[]
}
