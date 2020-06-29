import React, { useState, useEffect } from 'react'
import ReactMultiSelect from 'react-multi-select-component'

type MultiSelectProps = {
  label?: string
  name?: string
  options: string[]
  disabled?: boolean
  placeholder?: string
  values?: string[]
  onChange?(event: any): void
}

const reshapeToMulti = (options: string[]) =>
  options.map((option) => ({
    label: option,
    value: option,
  }))

const MultiSelect = ({
  label,
  name,
  options,
  placeholder,
  values,
  onChange,
  ...attrs
}: MultiSelectProps) => {
  const multiOptions = reshapeToMulti(options)
  const [multiSelected, setMultiSelected] = useState(
    reshapeToMulti(values || [])
  )

  useEffect(() => {
    if (onChange && name) {
      onChange({
        target: {
          name,
          value: multiSelected.map((selected) => selected.value),
        },
      })
    }
  }, [multiSelected, name, onChange])

  return (
    <ReactMultiSelect
      {...attrs}
      options={multiOptions}
      value={multiSelected}
      onChange={setMultiSelected}
      filterOptions={(options, filter) =>
        filter
          ? options.filter(
              ({ value }) => value && value.match(new RegExp(filter, 'i'))
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
