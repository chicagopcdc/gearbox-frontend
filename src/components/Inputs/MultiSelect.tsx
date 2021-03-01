import React, { useState } from 'react'
import ReactMultiSelect from 'react-multi-select-component'
import { MatchFormFieldOption } from '../../model'

type MultiSelectProps = {
  label?: string
  name?: string
  options: MatchFormFieldOption[]
  disabled?: boolean
  placeholder?: string
  value?: any[]
  onChange?(event: any): void
}

function reshapeToMulti(options: MatchFormFieldOption[], value?: any[]) {
  return value === undefined
    ? options.map(({ label, value }) => ({ label, value }))
    : options.filter((option) => value.includes(option.value))
}

function MultiSelect({
  label,
  name,
  options,
  placeholder,
  value = [],
  onChange,
  ...attrs
}: MultiSelectProps) {
  const multiOptions = reshapeToMulti(options)
  const [multiSelected, setMultiSelected] = useState(
    reshapeToMulti(options, value)
  )

  function handleChange(selected: MatchFormFieldOption[]) {
    setMultiSelected(selected)
    if (onChange && name)
      onChange({ target: { name, value: selected.map(({ value }) => value) } })
  }

  return (
    <ReactMultiSelect
      {...attrs}
      options={multiOptions}
      value={multiSelected}
      onChange={handleChange}
      filterOptions={(options, filter) =>
        filter
          ? options.filter(
              ({ label }) => label && label.match(new RegExp(filter, 'i'))
            )
          : options
      }
      hasSelectAll={false}
      labelledBy={label || ''}
      overrideStrings={{ selectSomeItems: placeholder || '' }}
    />
  )
}

export default MultiSelect
