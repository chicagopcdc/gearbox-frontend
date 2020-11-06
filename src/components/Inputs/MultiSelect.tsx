import React, { useState, useEffect } from 'react'
import ReactMultiSelect from 'react-multi-select-component'

type MultiSelectProps = {
  label?: string
  name?: string
  options: string[]
  disabled?: boolean
  placeholder?: string
  value?: string[]
  onChange?(event: any): void
}

function reshapeToMulti(options: string[]) {
  return options.map((option) => ({
    label: option,
    value: option,
  }))
}

function MultiSelect({
  label,
  name,
  options,
  placeholder,
  value,
  onChange,
  ...attrs
}: MultiSelectProps) {
  const multiOptions = reshapeToMulti(options)
  const [multiSelected, setMultiSelected] = useState(
    reshapeToMulti(value || [])
  )

  useEffect(() => {
    const reshaped = reshapeToMulti(value || [])
    if (JSON.stringify(reshaped) !== JSON.stringify(multiSelected))
      setMultiSelected(reshaped)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

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
