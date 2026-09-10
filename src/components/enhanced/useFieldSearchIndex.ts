import { useMemo } from 'react'
import type { MatchFormConfig, MatchFormValues } from '../../model'
import { getIsFieldShowing } from '../../utils'
import type { SearchableField } from './types'

export function useFieldSearchIndex(
  config: MatchFormConfig,
  values: MatchFormValues,
  isFilterActive: boolean
): SearchableField[] {
  return useMemo(() => {
    const groupMap = new Map(config.groups.map((g) => [g.id, g.name]))
    const fieldMap = new Map(config.fields.map((f) => [f.id, f]))

    return config.fields
      .filter((field) => !isFilterActive || field.relevant)
      .map((field) => {
        const isHiddenByShowIf =
          field.showIf !== undefined &&
          !getIsFieldShowing(field.showIf, config, values)

        const isFilled =
          values[field.id] !== undefined && values[field.id] !== ''

        let triggerFieldId: number | undefined
        let triggerFieldLabel: string | undefined

        if (
          isHiddenByShowIf &&
          field.showIf &&
          field.showIf.criteria.length > 0
        ) {
          triggerFieldId = field.showIf.criteria[0].id
          const triggerField = fieldMap.get(triggerFieldId)
          if (triggerField) {
            triggerFieldLabel = triggerField.label || triggerField.name
          }
        }

        return {
          id: field.id,
          label: field.label || field.name,
          name: field.name,
          groupId: field.groupId,
          groupName: groupMap.get(field.groupId) || 'General',
          isHiddenByShowIf,
          isFilled,
          triggerFieldId,
          triggerFieldLabel,
        }
      })
  }, [config, values, isFilterActive])
}
