import React from 'react'
import Checkbox from './Checkbox'
import Select from './Select'
import TextField from './TextField'
import Radio from './Radio'
import MultiSelect from './MultiSelect'

type FieldConfig = {
  type: string
  name: string
  label?: string
  options?: string[]
  [key: string]: any
}

type FieldProps = {
  config: FieldConfig
  value: any
  onChange(event: any): void
}

const Field = ({
  config: { type, name, label, options, ...attrs },
  value,
  onChange,
}: FieldProps) => {
  switch (type) {
    case 'text':
    case 'number':
      return (
        <TextField
          type={type}
          name={name}
          label={label}
          value={value}
          onChange={onChange}
          {...attrs}
        />
      )
    case 'checkbox':
      return (
        <Checkbox
          name={name}
          label={label}
          checked={!!value}
          onChange={onChange}
          {...attrs}
        />
      )
    case 'select':
      return (
        <Select
          name={name}
          label={label}
          options={options ? options : []}
          value={value}
          onChange={onChange}
          {...attrs}
        />
      )
    case 'radio':
      return (
        <Radio
          name={name}
          label={label}
          options={options ? options : []}
          value={value}
          onChange={onChange}
          {...attrs}
        />
      )
    case 'multiselect':
      return (
        <MultiSelect
          name={name}
          label={label}
          options={options ? options : []}
          value={value}
          onChange={onChange}
          {...attrs}
        />
      )
    default:
      return null
  }
}

export default Field
