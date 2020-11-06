import React from 'react'

type SelectProps = {
  label?: string
  name?: string
  options: string[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
  value?: string
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
}

function Select({
  label,
  name,
  options,
  placeholder,
  value = '',
  disabled = false,
  ...attrs
}: SelectProps) {
  const baseClassName =
    'form-select rounded-none border border-solid border-black p-1 w-full'
  const disabledClassName = `${baseClassName} cursor-not-allowed bg-gray-200`
  const selectAttrs = {
    ...attrs,
    className: disabled ? disabledClassName : baseClassName,
    disabled,
    id: name,
    name,
    value,
    style: { minWidth: '200px' },
  }
  return (
    <div className="flex flex-col">
      {label && <label htmlFor={name || ''}>{label}</label>}
      <select {...selectAttrs}>
        {placeholder && (
          <option value="" hidden>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Select
