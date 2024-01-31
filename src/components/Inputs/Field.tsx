import Checkbox from './Checkbox'
import Select from './Select'
import TextField from './TextField'
import Radio from './Radio'
import MultiSelect from './MultiSelect'
import { MatchFormFieldConfig, MatchFormFieldOption } from '../../model'

type FieldConfig = {
  type: MatchFormFieldConfig['type']
  name: string
  label?: string | React.ReactNode
  options?: MatchFormFieldOption[]
  [key: string]: any
}

type FieldProps = {
  config: FieldConfig
  value?: any
  onChange?(event: any): void
}

function Field({
  config: { type, options = [], label, ...attrs },
  value,
  onChange,
}: FieldProps) {
  switch (type) {
    case 'text':
    case 'number':
      return <TextField {...{ type, value, onChange, label, ...attrs }} />
    case 'checkbox':
      return <Checkbox {...{ checked: value, onChange, label, ...attrs }} />
    case 'select':
      return <Select {...{ options, value, onChange, label, ...attrs }} />
    case 'radio':
      return <Radio {...{ options, value, onChange, label, ...attrs }} />
    case 'multiselect':
      return (
        <MultiSelect
          {...{
            options,
            value,
            onChange,
            label: label as string,
            ...attrs,
          }}
        />
      )
    case 'age':
      return (
        <TextField {...{ type: 'number', value, onChange, label, ...attrs }} />
      )
    default:
      return null
  }
}

export default Field
