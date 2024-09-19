import {
  ApiStatus,
  CriteriaValue,
  InputType,
  MatchFormFieldOption,
  StagingCriterion,
  StagingCriterionWithValueList,
} from '../model'
import Field from './Inputs/Field'
import Button from './Inputs/Button'
import React, { useEffect, useRef, useState } from 'react'
import {
  acceptStagingCriterion,
  createValue,
  publishStagingCriterion,
  saveStagingCriterion,
} from '../api/studyAdjudication'
import { RequestStatusBar } from './RequestStatusBar'

export function QuestionAdjudication({
  stagingCriterion,
  lookupValues,
  inputTypes,
  setLookupValues,
}: {
  stagingCriterion: StagingCriterionWithValueList
  lookupValues: CriteriaValue[]
  inputTypes: InputType[]
  setLookupValues: React.Dispatch<React.SetStateAction<CriteriaValue[]>>
}) {
  const checkIsList = (id: number): boolean => {
    return (
      inputTypes.find((inputType) => inputType.id === id)?.data_type === 'list'
    )
  }

  const [status, setStatus] = useState<
    StagingCriterion['criterion_adjudication_status']
  >(stagingCriterion.criterion_adjudication_status)

  const isEditable = status === 'NEW' || status === 'IN_PROCESS'

  const [selectedValues, setSelectedValues] = useState<MatchFormFieldOption[]>(
    stagingCriterion.value_list?.map((v) => ({
      value: v.id,
      label: v.value_string || '',
    })) || []
  )
  const [selectedInputTypeId, setSelectedInputTypeId] = useState<number>(
    stagingCriterion.input_type_id || 0
  )
  const [isList, setIsList] = useState<boolean>(
    checkIsList(stagingCriterion.input_type_id)
  )
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [loadingStatus, setLoadingStatus] = useState<ApiStatus>('not started')
  const timerIdRef = useRef<NodeJS.Timer | null>(null)
  const [canPublish, setCanPublish] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const isSendingReq = loadingStatus === 'sending'

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
    const code = formData.get('code')?.toString() || ''
    const displayName = formData.get('displayName')?.toString() || ''
    const description = formData.get('description')?.toString() || ''

    const { value_list, ...updatedStagingCriterion } = stagingCriterion
    setLoadingStatus('sending')
    saveStagingCriterion({
      ...updatedStagingCriterion,
      code,
      display_name: displayName,
      description,
      input_type_id: selectedInputTypeId,
      criterion_id: null,
      values: selectedValues.map((v) => v.value),
    })
      .then(() => {
        setLoadingStatus('success')
        setStatus('IN_PROCESS')
        setCanPublish(true)
      })
      .catch((err) => {
        console.error(err)
        setLoadingStatus('error')
      })
      .finally(
        () =>
          (timerIdRef.current = setTimeout(
            () => setLoadingStatus('not started'),
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
      const code = formData.get('code')?.toString() || ''
      const displayName = formData.get('displayName')?.toString() || ''
      const description = formData.get('description')?.toString() || ''

      setLoadingStatus('sending')
      publishStagingCriterion({
        code,
        active: true,
        display_name: displayName,
        description,
        values: selectedValues.map((v) => v.value),
        criterion_staging_id: stagingCriterion.id,
        input_type_id: selectedInputTypeId,
      })
        .then(() => {
          setLoadingStatus('success')
          setStatus('ACTIVE')
        })
        .catch((err) => {
          setErrorMsg(err.message)
          setLoadingStatus('error')
        })
        .finally(
          () =>
            (timerIdRef.current = setTimeout(
              () => setLoadingStatus('not started'),
              3000
            ))
        )
    }
  }

  const edit = () => setStatus('IN_PROCESS')

  const accept = () => {
    if (
      confirm(
        'Accepting the staging criterion will finalized the changes and can not be reverted. Are you sure to accept?'
      )
    ) {
      setLoadingStatus('sending')
      acceptStagingCriterion(stagingCriterion.id)
        .then(() => {
          setLoadingStatus('success')
          setStatus('ACTIVE')
        })
        .catch((err) => {
          console.error(err)
          setLoadingStatus('error')
        })
        .finally(
          () =>
            (timerIdRef.current = setTimeout(
              () => setLoadingStatus('not started'),
              3000
            ))
        )
    }
  }
  const onInputTypeSelected = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const inputTypeId = +event.target.value
    setSelectedInputTypeId(inputTypeId)
    const isListSelected = checkIsList(inputTypeId)
    setIsList(isListSelected)
    if (!isListSelected) {
      setSelectedValues([])
    }
    setCanPublish(false)
  }

  const onInputChange = (inputLabel: string) => {
    const optionExists = stagingCriterion.value_list?.some(
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
      const newOption: MatchFormFieldOption = {
        value: v.id,
        label: v.value_string || '',
      }
      setLookupValues((prev) => [...prev, v])
      setSelectedValues((prevSelected) => [...prevSelected, newOption])
      setIsCreating(false)
      setCanPublish(false)
      return newOption
    })
  }

  const formChanged = () => setCanPublish((prev) => (prev ? !prev : prev))

  return (
    <div className="my-4 p-4 border border-gray-400">
      <form ref={formRef} onChange={formChanged}>
        <div className="flex justify-between items-center mb-2">
          <h1>Status: {status}</h1>
          <div className="flex items-center">
            <RequestStatusBar
              loadingStatus={loadingStatus}
              errorMsg={errorMsg}
            />
            <ActionButtons
              status={status}
              isSendingReq={isSendingReq}
              canPublish={canPublish}
              save={save}
              publish={publish}
              edit={edit}
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
            type: 'text',
            name: 'code',
            label: 'Code',
            readOnly: !isEditable,
            defaultValue: stagingCriterion.code || '',
          }}
        />
        <Field
          config={{
            type: 'text',
            name: 'displayName',
            label: 'Display Name',
            readOnly: !isEditable,
            defaultValue: stagingCriterion.display_name || '',
          }}
        />
        <Field
          config={{
            type: 'text',
            name: 'description',
            label: 'Description',
            readOnly: !isEditable,
            defaultValue: stagingCriterion.description || '',
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
        value={selectedInputTypeId}
        onChange={onInputTypeSelected}
      />
      {isList && (
        <>
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
            value={selectedValues}
            onChange={(newValues) => {
              setSelectedValues(newValues)
              setCanPublish(false)
            }}
          />
        </>
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
  edit,
  accept,
}: {
  status: StagingCriterion['criterion_adjudication_status']
  isSendingReq: boolean
  canPublish: boolean
  save: () => void
  publish: () => void
  edit: () => void
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
      <>
        <Button
          size="small"
          otherClassName="mr-4"
          disabled={isSendingReq}
          onClick={edit}
        >
          Edit
        </Button>
        <Button size="small" onClick={accept} disabled={isSendingReq}>
          Accept
        </Button>
      </>
    )
  }
  return null
}
