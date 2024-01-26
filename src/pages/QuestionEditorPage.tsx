import { ApiStatus, MatchFormFieldConfig, MatchFormGroupConfig } from '../model'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'
import React, { useEffect, useRef, useState } from 'react'
import { buildMatchForm, updateMatchFormConfig } from '../api/matchFormConfig'
import DropdownSection from '../components/DropdownSection'
import FieldWrapper from '../components/FieldWrapper'
import Field from '../components/Inputs/Field'
import Button from '../components/Inputs/Button'
import { ErrorRetry } from '../components/ErrorRetry'
import { AlertCircle, Check, Loader } from 'react-feather'
import MatchInfoDetails from '../components/MatchInfoDetails'
import { getShowIfDetails } from '../utils'

function reorder<T extends MatchFormGroupConfig | MatchFormFieldConfig>(
  list: T[],
  startIndex: number,
  endIndex: number
): T[] {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

export function QuestionEditorPage() {
  const [fields, setFields] = useState<MatchFormFieldConfig[]>([])
  const [originalFields, setOriginalFields] = useState<MatchFormFieldConfig[]>(
    []
  )
  const [groups, setGroups] = useState<MatchFormGroupConfig[]>([])
  const [confirmDisabled, setConfirmDisabled] = useState(true)
  const [loadingStatus, setLoadingStatus] = useState<ApiStatus>('not started')
  const [confirmStatus, setConfirmStatus] = useState<ApiStatus>('not started')
  const timerIdRef = useRef<NodeJS.Timer | null>(null)

  const loadMatchForm = () => {
    setLoadingStatus('sending')
    buildMatchForm(false)
      .then((res) => {
        setFields(res.fields)
        setOriginalFields(res.fields)
        setGroups(res.groups)
        setLoadingStatus('success')
      })
      .catch((err) => {
        console.error(err)
        setLoadingStatus('error')
      })
  }

  useEffect(() => {
    loadMatchForm()
    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current)
      }
    }
  }, [])

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result
    if (destination && destination.droppableId === source.droppableId) {
      const fieldsWithinGroup = fields.filter(
        (f) => f.groupId === +destination.droppableId
      )
      const fromField = fieldsWithinGroup[source.index]
      const toField = fieldsWithinGroup[destination.index]
      const fromIndex = fields.findIndex((f) => f.id === fromField.id)
      const toIndex = fields.findIndex((f) => f.id === toField.id)
      const newFields = reorder(fields, fromIndex, toIndex)
      setFields(newFields)
      setConfirmDisabled(false)
    }
  }

  const confirm = () => {
    setConfirmStatus('sending')
    setConfirmDisabled(true)
    updateMatchFormConfig({
      groups,
      fields,
    })
      .then(() => setConfirmStatus('success'))
      .catch((err) => {
        setConfirmStatus('error')
        setFields(originalFields)
        console.error(err)
      })
      .finally(
        () =>
          (timerIdRef.current = setTimeout(
            () => setConfirmStatus('not started'),
            3000
          ))
      )
  }

  if (loadingStatus === 'not started' || loadingStatus === 'sending') {
    return <div>Loading...</div>
  } else if (loadingStatus === 'error') {
    return <ErrorRetry retry={loadMatchForm} />
  }

  return (
    <div className="h-screen pb-8">
      <section className="h-full overflow-scroll">
        <div className="top-0 sticky flex items-center justify-between bg-white px-8 py-2">
          <h1 className="uppercase text-primary font-bold z-10">
            <span>Question List</span>
          </h1>
          <div className="flex items-center">
            {confirmStatus === 'sending' ? (
              <Loader className="mr-2" />
            ) : confirmStatus === 'success' ? (
              <h2 className="text-base text-green-600 mr-4 flex">
                <Check />
                Updated Successfully
              </h2>
            ) : (
              confirmStatus === 'error' && (
                <h2 className="text-base text-red-600 mr-4 flex">
                  <AlertCircle />
                  Updated Unsuccessfully
                </h2>
              )
            )}
            <Button disabled={confirmDisabled} onClick={confirm}>
              Confirm
            </Button>
          </div>
        </div>
        <div className="px-8 pb-4">
          <DragDropContext onDragEnd={onDragEnd}>
            {groups.map((group) => (
              <DropdownSection
                key={group.id}
                backgroundColor="bg-white"
                name={group.name || 'General'}
                isCollapsedAtStart
              >
                <Droppable droppableId={group.id.toString()}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="mt-2"
                    >
                      {fields
                        .filter((field) => field.groupId === group.id)
                        .map((field, index) => (
                          <Draggable
                            key={field.id}
                            draggableId={field.id.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  marginBottom: '8px',
                                  border: '1px solid lightgrey',
                                  padding: '8px',
                                }}
                              >
                                <FieldWrapper key={field.id} isShowing>
                                  <Field
                                    config={{
                                      type: field.type,
                                      options: field.options,
                                      label: field.label,
                                      name: field.id.toString(),
                                      disabled: false,
                                    }}
                                  />
                                  <div className="mt-4 border p-4">
                                    <div className="mb-4 flex justify-between">
                                      <h1>
                                        {field.showIf
                                          ? 'Show If:'
                                          : 'Always show'}{' '}
                                      </h1>
                                      <Button size="small">
                                        Edit Show If Conditions
                                      </Button>
                                    </div>
                                    {field.showIf && (
                                      <MatchInfoDetails
                                        matchInfoAlgorithm={getShowIfDetails(
                                          fields,
                                          field.showIf
                                        )}
                                      />
                                    )}
                                  </div>
                                </FieldWrapper>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DropdownSection>
            ))}
          </DragDropContext>
        </div>
      </section>
    </div>
  )
}
