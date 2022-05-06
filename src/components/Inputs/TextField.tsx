import type React from 'react'
import { useState } from 'react'

type TextFieldProps = {
  label?: string | React.ReactNode
  name?: string
  type?: 'text' | 'password' | 'number'
  autoFocus?: boolean
  disabled?: boolean
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
  value,
  disabled,
  readOnly,
  ...attrs
}: TextFieldProps) {
  const [isTouched, setIsTouched] = useState(false)

  const baseClassName = 'flex flex-col'
  const disabledClassName = `${baseClassName} text-gray-400`
  const className = disabled ? disabledClassName : baseClassName

  const baseInputClassName =
    'rounded-none border border-solid border-black p-1 w-full'
  const disabledInputClassName = `${baseInputClassName} cursor-not-allowed bg-gray-200 border-gray-400`
  const inputAttrs = {
    ...attrs,
    className:
      disabled || readOnly
        ? disabledInputClassName
        : baseInputClassName + (isTouched ? ' touched' : ''),
    disabled,
    id: name,
    name,
    readOnly,
    type,
    value,
    onFocus() {
      if (!isTouched) setIsTouched(true)
    },
  }
  return (
    <div className={className}>
      {label && (
        <label className="mb-1" htmlFor={name}>
          {label}
        </label>
      )}
      <input {...inputAttrs} />
    </div>
  )
}

export default TextField
