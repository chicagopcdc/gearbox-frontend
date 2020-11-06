import React from 'react'

type TextFieldProps = {
  label?: string
  name?: string
  type?: 'text' | 'password' | 'number'
  autoFocus?: boolean
  pattern?: string
  placeholder?: string
  readOnly?: boolean
  required?: boolean
  min?: number
  max?: number
  step?: number
  value?: string | number
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

function TextField({
  label = '',
  name = '',
  type = 'text',
  value = '',
  readOnly = false,
  ...attrs
}: TextFieldProps) {
  const baseInputClassName =
    'form-input rounded-none border border-solid border-black p-1 w-full'
  const inputClassName = readOnly
    ? `${baseInputClassName} cursor-not-allowed bg-gray-200`
    : baseInputClassName
  return (
    <div className="flex flex-col">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        {...attrs}
        id={name}
        name={name}
        value={value}
        className={inputClassName}
        readOnly={readOnly}
        type={type}
      />
    </div>
  )
}

export default TextField
