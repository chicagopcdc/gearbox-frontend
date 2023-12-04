import {
  MatchFormConfig,
  MatchFormFieldConfig,
  MatchFormGroupConfig,
} from '../model'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd'
import React, { useEffect, useState } from 'react'
import { updateMatchFormConfig } from '../api/matchFormConfig'
import DropdownSection from '../components/DropdownSection'
import FieldWrapper from '../components/FieldWrapper'
import Field from '../components/Inputs/Field'
import Button from '../components/Inputs/Button'

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

export function QuestionEditorPage({
  matchFormConfig,
}: {
  matchFormConfig: MatchFormConfig
}) {
  const [fields, setFields] = useState(matchFormConfig.fields)
  const [groups, setGroups] = useState(matchFormConfig.groups)
  const [confirmDisabled, setConfirmDisabled] = useState(true)

  useEffect(() => {
    setGroups(matchFormConfig.groups)
    setFields(matchFormConfig.fields)
  }, [matchFormConfig.groups, matchFormConfig.fields])

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
    updateMatchFormConfig({
      groups,
      fields,
    })
      .then(() => setConfirmDisabled(true))
      .catch(() => setFields(matchFormConfig.fields))
  }

  return (
    <div className="h-screen pb-8">
      <section className="h-full overflow-scroll">
        <div className="flex px-8 py-2 z-10 items-center justify-between">
          <h1 className="sticky top-0 bg-white uppercase text-primary font-bold ">
            <span>Question List</span>
          </h1>
          <Button disabled={confirmDisabled} onClick={confirm}>
            Confirm
          </Button>
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
