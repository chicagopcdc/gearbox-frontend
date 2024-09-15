import {
  MultiSelect as ReactMultiSelect,
  SelectProps,
} from 'react-multi-select-component'
import type { MatchFormFieldOption } from '../../model'

type MultiSelectProps = {
  label?: string
  name?: string
  options: MatchFormFieldOption[]
  disabled?: boolean
  placeholder?: string
  value?: MatchFormFieldOption[]
  onChange?(event: any): void
  onCreateOptions?(label: string): void
  isCreatable?: boolean
  isLoading?: boolean
}

function MultiSelect({
  label,
  name,
  options,
  placeholder,
  value = [],
  disabled,
  isCreatable = true,
  isLoading = false,
  ...attrs
}: MultiSelectProps) {
  const baseClassName = 'flex flex-col'
  const multiSelectAttrs: SelectProps = {
    ...attrs,
    disabled,
    labelledBy: name || '',
    value,
    options,
    isCreatable,
    isLoading,
  }

  return (
    <div className={baseClassName}>
      {label && (
        <label className="mb-1" htmlFor={name}>
          {label}
        </label>
      )}
      <ReactMultiSelect {...multiSelectAttrs} />
    </div>
  )
}

export default MultiSelect
