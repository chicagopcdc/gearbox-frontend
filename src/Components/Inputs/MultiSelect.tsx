import React, { useState, useEffect } from 'react'
import ReactMultiSelect from 'react-multi-select-component'

type FormikMinimalTarget = { name: string; value: string[] }

type MultiSelectProps = {
  label?: string
  name?: string
  options: string[]
  disabled?: boolean
  placeholder?: string
  values?: string[]
  onChange?({ target }: { target: FormikMinimalTarget }): void
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
  values,
  disabled,
  placeholder,
  onChange,
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
      options={multiOptions}
      value={multiSelected}
      onChange={setMultiSelected}
      disabled={disabled}
      labelledBy={label || ''}
      overrideStrings={{
        selectSomeItems: placeholder || '',
      }}
      hasSelectAll={false}
      filterOptions={(options, filter) =>
        filter
          ? options.filter(
              ({ value }) => value && value.match(new RegExp(filter, 'i'))
            )
          : options
      }
    />
  )
}

export default MultiSelect
