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
  value?: MatchFormFieldOption[]
  onChange?(event: any): void
  onCreateOption?(label: string): void
  isCreatable?: boolean
  isLoading?: boolean
  hasSelectAll?: boolean
  closeOnChangedValue?: boolean
  className?: string
}

function MultiSelect({
  label,
  name,
  options,
  value = [],
  disabled,
  isCreatable = true,
  isLoading = false,
  hasSelectAll = true,
  closeOnChangedValue = false,
  className = '',
  ...attrs
}: MultiSelectProps) {
  const baseClassName = 'flex flex-col relative z-50'
  const multiSelectAttrs: SelectProps = {
    ...attrs,
    disabled,
    labelledBy: name || '',
    value,
    options,
    isCreatable,
    isLoading,
    hasSelectAll,
    closeOnChangedValue,
    className,
  }

  return (
    <div className={`${baseClassName} ${className}`}>
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
