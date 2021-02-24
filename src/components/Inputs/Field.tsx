import React from 'react'
import Checkbox from './Checkbox'
import Select from './Select'
import TextField from './TextField'
import Radio from './Radio'
import MultiSelect from './MultiSelect'
import AgeField from './AgeField'
import { MatchFormFieldOption } from '../../model'

type FieldConfig = {
  type: string
  name: string
  label?: string
  options?: MatchFormFieldOption[]
  [key: string]: any
}

type FieldProps = {
  config: FieldConfig
  value: any
  onChange(event: any): void
}

function Field({
  config: { type, options = [], ...attrs },
  value,
  onChange,
}: FieldProps) {
  switch (type) {
    case 'text':
    case 'number':
      return <TextField {...{ type, value, onChange, ...attrs }} />
    case 'checkbox':
      return <Checkbox {...{ checekd: !!value, onChange, ...attrs }} />
    case 'select':
      return <Select {...{ options, value, onChange, ...attrs }} />
    case 'radio':
      return <Radio {...{ options, value, onChange, ...attrs }} />
    case 'multiselect':
      return <MultiSelect {...{ options, value, onChange, ...attrs }} />
    case 'age':
      return <AgeField {...{ value, onChange, ...attrs }} />
    default:
      return null
  }
}

export default Field
