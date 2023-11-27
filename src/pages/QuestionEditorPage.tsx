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
import { useEffect, useState } from 'react'
import { updateMatchFormConfig } from '../api/matchFormConfig'

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

  useEffect(() => {
    setGroups(matchFormConfig.groups)
    setFields(matchFormConfig.fields)
  }, [matchFormConfig.groups, matchFormConfig.fields])

  const onDragEnd = (result: DropResult) => {
    if (result.destination) {
      const oldGroups = Array.from(groups)
      const newGroups = reorder(
        groups,
        result.source.index,
        result.destination.index
      )
      setGroups(newGroups)
      updateMatchFormConfig({
        fields,
        groups: newGroups,
      }).catch(() => setGroups(oldGroups))
    }
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="question-editor">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {groups.map((g, index) => (
              <Draggable key={g.id} draggableId={g.id.toString()} index={index}>
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
                    {g.name}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
