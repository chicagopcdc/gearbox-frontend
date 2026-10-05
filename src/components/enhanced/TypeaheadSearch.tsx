import { useState } from 'react'
import type { SearchableField } from './types'

type TypeaheadSearchProps = {
  fields: SearchableField[]
  onSelectField: (id: number) => void
}

function TypeaheadSearch({ fields, onSelectField }: TypeaheadSearchProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const filteredFields = query.trim()
    ? fields
        .filter((field) => {
          const q = query.toLowerCase()
          return (
            field.name.toLowerCase().includes(q) ||
            field.label.toLowerCase().includes(q) ||
            field.groupName.toLowerCase().includes(q)
          )
        })
        .slice(0, 8)
    : []

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setIsOpen(e.target.value.trim().length > 0)
    setActiveIndex(0)
  }

  const handleSelect = (field: SearchableField) => {
    setQuery('')
    setIsOpen(false)
    setActiveIndex(-1)
    if (field.isHiddenByShowIf && field.triggerFieldId) {
      onSelectField(field.triggerFieldId)
    } else {
      onSelectField(field.id)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredFields.length === 0) {
      if (e.key === 'Escape') {
        setQuery('')
        setIsOpen(false)
        setActiveIndex(0)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((prev) =>
          prev < filteredFields.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : filteredFields.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (filteredFields.length > 0) {
          handleSelect(filteredFields[activeIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setActiveIndex(0)
        break
      case 'Tab':
        setIsOpen(false)
        setActiveIndex(0)
        break
    }
  }

  const handleBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsOpen(false)
      setActiveIndex(0)
    }
  }

  const listboxId = 'typeahead-listbox'
  const getOptionId = (index: number) => `option-${index}`

  return (
    <div className="relative" onBlur={handleBlur}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search for conditions (i.e. age, diagnosis, mutations...)"
        className="rounded-none border border-solid border-black p-1 w-full"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={
          activeIndex >= 0 ? getOptionId(activeIndex) : undefined
        }
        aria-autocomplete="list"
      />
      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-10 w-full bg-white border border-solid border-black mt-1 max-h-80 overflow-y-auto"
        >
          {filteredFields.length === 0 ? (
            <li className="px-4 py-2 text-gray-500 text-sm">
              No fields found. Try a different term.
            </li>
          ) : (
            <>
              <li className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-300">
                Fields matching your search
              </li>
              {filteredFields.map((field, index) => (
                <li
                  key={field.id}
                  id={getOptionId(index)}
                  role="option"
                  aria-selected={index === activeIndex}
                  onClick={() => handleSelect(field)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleSelect(field)
                    }
                  }}
                  tabIndex={-1}
                  className={`px-4 py-2 cursor-pointer border-b border-gray-200 ${
                    index === activeIndex ? 'bg-gray-100' : 'hover:bg-gray-100'
                  } ${field.isHiddenByShowIf ? 'text-gray-400' : ''}`}
                >
                  <div className="text-sm">{field.name}</div>
                  <div className="text-xs text-gray-500">
                    {field.groupName}
                    {field.isHiddenByShowIf &&
                      field.triggerFieldLabel &&
                      ` • Available after ${field.triggerFieldLabel}`}
                  </div>
                </li>
              ))}
            </>
          )}
        </ul>
      )}
    </div>
  )
}

export default TypeaheadSearch
