import {
  Builder,
  BuilderProps,
  Config,
  Fields,
  ImmutableTree,
  JsonGroup,
  Query,
  Utils as QbUtils,
} from '@react-awesome-query-builder/ui'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { QueryBuilderState } from '../hooks/useQueryBuilderState'
import {
  getInitQueryValue,
  getShowIfFields,
  getShowIfInitValue,
  initialQueryBuilderConfig,
  jsonGroupToShowIf,
} from '../utils'
import { MatchFormFieldConfig } from '../model'

export function ShowIfBuilder({
  matchFormFields,
  showIfFields,
  currentField,
  setFields,
  setConfirmDisabled,
}: {
  matchFormFields: MatchFormFieldConfig[]
  showIfFields: Fields
  currentField: MatchFormFieldConfig
  setFields: (fields: MatchFormFieldConfig[]) => void
  setConfirmDisabled: (d: boolean) => void
}) {
  const queryBuilderConfig = {
    ...initialQueryBuilderConfig,
    settings: {
      ...initialQueryBuilderConfig.settings,
      showNot: false,
    },
    fields: showIfFields,
  }
  const initialShowIf = currentField.showIf
  const initialTree = QbUtils.checkTree(
    QbUtils.loadTree(
      initialShowIf
        ? getShowIfInitValue(initialShowIf, matchFormFields)
        : getInitQueryValue()
    ),
    queryBuilderConfig
  )
  const [queryBuilderState, setQueryBuilderState] = useState<QueryBuilderState>(
    {
      tree: initialTree,
      config: queryBuilderConfig,
    }
  )

  const onChange = useCallback(
    (immutableTree: ImmutableTree, config: Config) => {
      console.log('callback')
      setQueryBuilderState((prevState) => ({
        ...prevState,
        tree: immutableTree,
        config,
      }))
      const showIf = jsonGroupToShowIf(
        QbUtils.getTree(immutableTree) as JsonGroup
      )
      setFields(
        matchFormFields.map((f) =>
          f.id === currentField.id
            ? {
                ...currentField,
                showIf,
              }
            : f
        )
      )
      setConfirmDisabled(false)
    },
    [currentField, matchFormFields, setFields, setConfirmDisabled]
  )
  const renderBuilder = (props: BuilderProps) => (
    <div className="query-builder-container" style={{ padding: '10px' }}>
      <div className="query-builder qb-lite">
        <Builder {...props} />
      </div>
    </div>
  )
  return (
    <Query
      {...queryBuilderState.config}
      value={queryBuilderState.tree}
      onChange={onChange}
      renderBuilder={renderBuilder}
    />
  )
}
