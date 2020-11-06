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
  ...attr
}: SelectProps) {
  const baseSelectClassName =
    'form-select rounded-none border border-solid border-black p-1 w-full'
  const selectClassName = disabled
    ? `${baseSelectClassName} cursor-not-allowed bg-gray-200`
    : baseSelectClassName
  return (
    <div className="flex flex-col">
      {label && <label htmlFor={name || ''}>{label}</label>}
      <select
        {...attr}
        id={name}
        name={name}
        value={value}
        className={selectClassName}
        disabled={disabled}
        style={{ minWidth: '200px' }}
      >
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
