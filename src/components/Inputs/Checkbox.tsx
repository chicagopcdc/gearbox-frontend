import type React from 'react'

type CheckboxProps = {
  label?: string | React.ReactNode
  name?: string
  checked?: boolean
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

function Checkbox({
  label = '',
  name = '',
  disabled,
  readOnly,
  onChange,
  ...attrs
}: CheckboxProps) {
  const className = disabled ? 'text-gray-400' : undefined

  const baseInputClassName =
    'rounded-none border border-solid border-black mr-4'
  const disabledInputClassName = `${baseInputClassName} border-gray-300 bg-gray-200`
  const checkboxAttrs = {
    ...attrs,
    className:
      disabled || readOnly ? disabledInputClassName : baseInputClassName,
    disabled,
    id: name,
    name,
    type: 'checkbox',
    onChange: disabled || readOnly ? undefined : onChange,
  }

  return (
    <div className={className}>
      <input {...checkboxAttrs} />
      {label && <label htmlFor={name}>{label}</label>}
    </div>
  )
}

export default Checkbox
