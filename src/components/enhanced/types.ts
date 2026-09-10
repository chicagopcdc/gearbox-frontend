import type { MatchFormConfig, MatchFormFieldConfig } from '../../model'

export type SearchableField = {
  id: MatchFormFieldConfig['id']
  label: string
  name: string
  groupId: MatchFormFieldConfig['groupId']
  groupName: string
  isHiddenByShowIf: boolean
  isFilled: boolean
  triggerFieldId?: number
  triggerFieldLabel?: string
}

export type CategorySummary = {
  id: MatchFormConfig['groups'][number]['id']
  name: string
  visibleCount: number
  filledCount: number
}
