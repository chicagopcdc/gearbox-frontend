import {
  ApiStatus,
  CriteriaValue,
  InputType,
  MatchFormFieldOption,
  CriterionStaging,
  CriterionStagingWithValueList,
  Criterion,
} from '../model'
import Field from './Inputs/Field'
import Button from './Inputs/Button'
import React, { useEffect, useRef, useState } from 'react'
import { RequestStatusBar } from './RequestStatusBar'
import { createValue } from '../api/value'
import {
  acceptCriterionStaging,
  publishCriterionStaging,
  saveCriterionStaging,
} from '../api/criterionStaging'

type Status = CriterionStaging['criterion_adjudication_status']

export function CriteriaAnnotationVerification({
  stagingCriterion: initialStagingCriterion,
  criteria,
  lookupValues,
  inputTypes,
  setLookupValues,
  onStagingUpdated,
}: {
  stagingCriterion: CriterionStagingWithValueList
  criteria: Criterion[]
  lookupValues: CriteriaValue[]
  inputTypes: InputType[]
  setLookupValues: React.Dispatch<React.SetStateAction<CriteriaValue[]>>
  onStagingUpdated: (updated: CriterionStagingWithValueList) => void
}) {
  const checkIsList = (id: number): boolean => {
    return (
      inputTypes.find((inputType) => inputType.id === id)?.data_type === 'list'
    )
  }
  const [stagingCriterion, setStagingCriterion] =
    useState<CriterionStagingWithValueList>(initialStagingCriterion)
  const [existingCriterion, setExistingCriterion] = useState<
    Criterion | undefined
  >(
    stagingCriterion.criterion_adjudication_status === 'EXISTING'
      ? criteria.find((c) => c.code === stagingCriterion.code)
      : undefined
  )
  const status: Status =
    stagingCriterion.criterion_adjudication_status === 'ACTIVE'
      ? 'ACTIVE'
      : existingCriterion
      ? 'EXISTING'
      : stagingCriterion.criterion_adjudication_status

  const isEditable = status === 'NEW' || status === 'IN_PROCESS'
  const isCodeEditable = status !== 'ACTIVE'

  const [isList, setIsList] = useState<boolean>(
    checkIsList(
      existingCriterion
        ? existingCriterion.input_type_id
        : stagingCriterion.input_type_id
    )
  )
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [apiStatus, setApiStatus] = useState<ApiStatus>('not started')
  const timerIdRef = useRef<NodeJS.Timer | null>(null)
  const [canPublish, setCanPublish] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const isSendingReq = apiStatus === 'sending'

  useEffect(() => {
    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current)
      }
    }
  }, [])
  const save = () => {
    if (!formRef.current) {
      return
    }
    const formData = new FormData(formRef.current)
    const displayName = formData.get('displayName')?.toString() || ''
    const description = formData.get('description')?.toString() || ''

    const { criterion_value_list, ...updatedCriterionStaging } =
      stagingCriterion
    setApiStatus('sending')
    saveCriterionStaging({
      ...updatedCriterionStaging,
      display_name: displayName,
      description,
      criterion_id: null,
      criterion_value_ids:
        stagingCriterion.criterion_value_list?.map((v) => v.id) || [],
    })
      .then(({ criterion_value_ids, ...rest }) => {
        setApiStatus('success')
        setCanPublish(true)
        const idSet = new Set(criterion_value_ids)
        const updated: CriterionStagingWithValueList = {
          ...rest,
          criterion_value_list: lookupValues.filter((v) => idSet.has(v.id)),
        }
        setStagingCriterion(updated)
        onStagingUpdated(updated)
      })
      .catch((err) => {
        console.error(err)
        setApiStatus('error')
      })
      .finally(
        () =>
          (timerIdRef.current = setTimeout(
            () => setApiStatus('not started'),
            3000
          ))
      )
  }

  const publish = () => {
    if (!formRef.current) {
      return
    }

    if (
      confirm(
        'Publishing the staging criterion will finalized the changes and can not be reverted. Are you sure to publish?'
      )
    ) {
      const formData = new FormData(formRef.current)
      const displayName = formData.get('displayName')?.toString() || ''
      const description = formData.get('description')?.toString() || ''

      setApiStatus('sending')
      publishCriterionStaging({
        code: stagingCriterion.code,
        active: true,
        display_name: displayName,
        description,
        values: stagingCriterion.criterion_value_list?.map((v) => v.id) || [],
        criterion_staging_id: stagingCriterion.id,
        input_type_id: stagingCriterion.input_type_id,
      })
        .then(() => {
          setApiStatus('success')
          // Use functional set to build the exact object we store + send up
          setStagingCriterion((prev) => {
            const updated: CriterionStagingWithValueList = {
              ...prev,
              criterion_adjudication_status: 'ACTIVE',
            }
            onStagingUpdated?.(updated)
            return updated
          })
        })
        .catch((err) => {
          setErrorMsg(err.message)
          setApiStatus('error')
        })
        .finally(
          () =>
            (timerIdRef.current = setTimeout(
              () => setApiStatus('not started'),
              3000
            ))
        )
    }
  }

  const accept = () => {
    if (
      confirm(
        'Accepting the staging criterion will finalized the changes and can not be reverted. Are you sure to accept?'
      )
    ) {
      if (!existingCriterion) {
        return
      }
      const {
        id,
        eligibility_criteria_id,
        echc_adjudication_status,
        criterion_adjudication_status,
        text,
        input_id,
        echc_value_ids,
      } = stagingCriterion

      const {
        code,
        id: criterion_id,
        display_name,
        description,
        values,
        input_type_id,
      } = existingCriterion

      setApiStatus('sending')
      saveCriterionStaging({
        id,
        code,
        criterion_adjudication_status,
        criterion_id,
        description,
        display_name,
        echc_adjudication_status,
        eligibility_criteria_id,
        text,
        input_id,
        input_type_id,
        echc_value_ids,
        criterion_value_ids: values.map((v) => v.id),
      })
        .then(() => acceptCriterionStaging(id))
        .then(() => {
          setApiStatus('success')
          setStagingCriterion((prev) => {
            const updated: CriterionStagingWithValueList = {
              ...prev,
              // reflect accepted -> ACTIVE and sync fields from the chosen existing criterion
              criterion_adjudication_status: 'ACTIVE',
              code,
              display_name,
              description,
              input_type_id,
              // keep values in sync with what we just saved
              criterion_value_list: values ?? prev.criterion_value_list ?? [],
            }
            onStagingUpdated?.(updated)
            return updated
          })
        })
        .catch((err) => {
          console.error(err)
          setApiStatus('error')
        })
        .finally(
          () =>
            (timerIdRef.current = setTimeout(
              () => setApiStatus('not started'),
              3000
            ))
        )
    }
  }
  const onInputTypeSelected = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const inputTypeId = +event.target.value
    setStagingCriterion((prev) => ({
      ...prev,
      input_type_id: inputTypeId,
    }))
    const isListSelected = checkIsList(inputTypeId)
    setIsList(isListSelected)
    if (!isListSelected) {
      setStagingCriterion((prev) => ({ ...prev, criterion_value_list: [] }))
    }
    setCanPublish(false)
  }

  const onInputChange = (inputLabel: string) => {
    const optionExists = stagingCriterion.criterion_value_list?.some(
      (v) => v.value_string?.toLowerCase() === inputLabel.toLowerCase()
    )

    if (!optionExists && inputLabel.trim() !== '' && !isCreating) {
      return handleCreateValue(inputLabel)
    }
  }

  const handleCreateValue = (
    inputLabel: string
  ): Promise<MatchFormFieldOption> => {
    const newValue: CriteriaValue = {
      id: 0,
      value_string: inputLabel,
      description: inputLabel,
      is_numeric: false,
      active: true,
      operator: 'eq',
      unit_id: 1,
      unit_name: 'none',
    }
    setIsCreating(true)
    return createValue(newValue).then((v) => {
      setLookupValues((prev) => [...prev, v])
      setIsCreating(false)
      setCanPublish(false)
      return { value: v.id, label: v.value_string || '' }
    })
  }

  const formChanged = () => setCanPublish((prev) => (prev ? !prev : prev))
  const existingCodeOptions = criteria.map((c) => ({
    value: c.code,
    label: c.code,
  }))
  return (
    <div className="my-4 p-4 border border-gray-400">
      <form
        key={existingCriterion?.id ?? stagingCriterion.id}
        ref={formRef}
        onChange={formChanged}
      >
        <div className="flex justify-between items-center mb-2">
          <h1>Status: {status}</h1>
          <div className="flex items-center">
            <RequestStatusBar apiStatus={apiStatus} errorMsg={errorMsg} />
            <ActionButtons
              status={status}
              isSendingReq={isSendingReq}
              canPublish={canPublish}
              save={save}
              publish={publish}
              accept={accept}
            />
          </div>
        </div>
        <Field
          config={{
            type: 'text',
            name: 'text',
            label: 'Text',
            readOnly: true,
            defaultValue: stagingCriterion.text || '',
          }}
        />
        <Field
          config={{
            type: 'multiselect',
            name: 'code',
            label: 'Code',
            options: [
              {
                value: stagingCriterion.code,
                label: stagingCriterion.code,
              },
              ...existingCodeOptions,
            ].filter(
              (option, idx, arr) =>
                arr.findIndex(
                  (item) =>
                    item.value === option.value && item.label === option.label
                ) === idx
            ),
            disabled: !isCodeEditable,
            closeOnChangedValue: true,
            hasSelectAll: false,
            onCreateOption: (
              newCode: string
            ): Promise<{
              label: string
              value: string
            }> =>
              new Promise((resolve) =>
                setTimeout(
                  () =>
                    resolve({
                      label: newCode,
                      value: newCode,
                    }),
                  100
                )
              ),
          }}
          value={
            existingCriterion
              ? [
                  {
                    value: existingCriterion.code,
                    label: existingCriterion.code,
                  },
                ]
              : [{ value: stagingCriterion.code, label: stagingCriterion.code }]
          }
          onChange={(newCodes: [{ label: string; value: string }]) => {
            if (newCodes.length) {
              const newCode = newCodes[newCodes.length - 1].value
              const newExistingCriterion = criteria.find(
                (c) => c.code === newCode
              )
              setExistingCriterion(() => newExistingCriterion)
              if (newExistingCriterion) {
                setIsList(checkIsList(newExistingCriterion.input_type_id))
              } else {
                setStagingCriterion((prev) => ({
                  ...prev,
                  criterion_adjudication_status:
                    prev.code === newCode
                      ? prev.criterion_adjudication_status
                      : 'NEW',
                  code: newCode,
                }))
                setIsList(checkIsList(stagingCriterion.input_type_id))
              }
            } else {
              setExistingCriterion(() => undefined)
              setIsList(false)
            }
          }}
        />
        <Field
          config={{
            type: 'text',
            name: 'displayName',
            label: 'Display Name',
            readOnly: !isEditable,
            defaultValue: existingCriterion
              ? existingCriterion.display_name
              : stagingCriterion.display_name || '',
          }}
        />
        <Field
          config={{
            type: 'text',
            name: 'description',
            label: 'Description',
            readOnly: !isEditable,
            defaultValue: existingCriterion
              ? existingCriterion.description
              : stagingCriterion.description || '',
          }}
        />
      </form>
      <Field
        config={{
          type: 'select',
          label: 'Input Type',
          name: 'inputType',
          placeholder: isEditable ? 'Select One' : 'None Selected',
          options: inputTypes.map((inputType) => ({
            value: inputType.id,
            label: `${inputType.data_type}: ${inputType.render_type}`,
          })),
          readOnly: !isEditable,
        }}
        value={
          existingCriterion
            ? existingCriterion.input_type_id || 0
            : stagingCriterion.input_type_id || 0
        }
        onChange={onInputTypeSelected}
      />
      {isList && (
        <Field
          config={{
            type: 'multiselect',
            label: `Options`,
            placeholder: 'Select One',
            name: 'values',
            options: lookupValues.map((lv) => ({
              value: lv.id,
              label: lv.value_string || '',
            })),
            onCreateOption: onInputChange,
            isLoading: isCreating,
            disabled: !isEditable,
          }}
          value={
            existingCriterion
              ? existingCriterion?.values.map((v) => ({
                  value: v.id,
                  label: v.value_string || '',
                }))
              : stagingCriterion.criterion_value_list?.map((v) => ({
                  value: v.id,
                  label: v.value_string || '',
                })) || []
          }
          onChange={(newValues: { value: number; label: string }[]) => {
            setStagingCriterion((prev) => {
              const newSelectedValues: CriteriaValue[] = newValues.map(
                (item) => {
                  // Check current selection in state
                  const inCurrentList = prev.criterion_value_list?.find(
                    (v) => v.id === item.value
                  )
                  if (inCurrentList) return inCurrentList

                  // Check updated lookupValues from props
                  const inLookup = lookupValues.find((v) => v.id === item.value)
                  if (inLookup) return inLookup

                  // Fallback for newly created values not yet in state/props
                  return {
                    id: item.value,
                    value_string: item.label,
                    description: item.label,
                    is_numeric: false,
                    active: true,
                    operator: 'eq',
                    unit_id: 1,
                    unit_name: 'none',
                  } as CriteriaValue
                }
              )

              return {
                ...prev,
                criterion_value_list: newSelectedValues,
              }
            })
            setCanPublish(false)
          }}
        />
      )}
    </div>
  )
}

function ActionButtons({
  status,
  isSendingReq,
  canPublish,
  save,
  publish,
  accept,
}: {
  status: Status
  isSendingReq: boolean
  canPublish: boolean
  save: () => void
  publish: () => void
  accept: () => void
}) {
  if (status === 'NEW' || status === 'IN_PROCESS') {
    return (
      <>
        <Button
          size="small"
          otherClassName="mr-4"
          disabled={isSendingReq}
          onClick={save}
        >
          Save
        </Button>
        <Button
          size="small"
          onClick={publish}
          disabled={isSendingReq || !canPublish}
        >
          Publish
        </Button>
      </>
    )
  } else if (status === 'EXISTING') {
    return (
      <Button size="small" onClick={accept} disabled={isSendingReq}>
        Accept
      </Button>
    )
  }
  return null
}
