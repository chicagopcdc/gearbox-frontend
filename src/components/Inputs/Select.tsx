import type React from 'react'
import type { MatchFormFieldOption } from '../../model'

type SelectProps = {
  label?: string | React.ReactNode
  name?: string
  options: MatchFormFieldOption[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
  value?: any
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
}

function getDescription(options: MatchFormFieldOption[], currentValue: any) {
  for (const { value, description } of options)
    if (value === currentValue) return description
}

function Select({
  label,
  name,
  options,
  placeholder,
  value,
  disabled = false,
  onChange,
  ...attrs
}: SelectProps) {
  const description = getDescription(options, value)

  const baseClassName = 'flex flex-col'
  const disabledClassName = `${baseClassName} text-gray-400`
  const className = disabled ? disabledClassName : baseClassName

  const baseInputClassName =
    'rounded-none border border-solid border-black p-1 w-full'
  const disabledInputClassName = `${baseInputClassName} cursor-not-allowed bg-gray-200 border-gray-400`
  const selectAttrs = {
    ...attrs,
    className: disabled ? disabledInputClassName : baseInputClassName,
    disabled,
    id: name,
    name,
    value,
    style: { minWidth: '200px' },
  }
  return (
    <div className={className}>
      {label && (
        <label className="mb-1" htmlFor={name || ''}>
          {label}
        </label>
      )}
      <select
        {...selectAttrs}
        onChange={(e) => {
          if (onChange)
            onChange({
              target: {
                name,
                value: e.target.value,
                type: Number.isNaN(Number.parseFloat(e.target.value))
                  ? undefined
                  : 'number',
              },
            } as React.ChangeEvent<HTMLSelectElement>)
        }}
      >
        {placeholder && (
          <option value="" hidden>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {description && (
        <div className="text-gray-400 text-sm italic pt-1">{description}</div>
      )}
    </div>
  )
}

export default Select
