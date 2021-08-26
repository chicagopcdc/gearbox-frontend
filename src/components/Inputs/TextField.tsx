import type React from 'react'
import { useState } from 'react'

type TextFieldProps = {
  label?: string | React.ReactNode
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
  const [isTouched, setIsTouched] = useState(false)

  const baseClassName =
    'rounded-none border border-solid border-black p-1 w-full'
  const readOnlyClassName = `${baseClassName} cursor-not-allowed bg-gray-200`
  const inputAttrs = {
    ...attrs,
    className: readOnly
      ? readOnlyClassName
      : baseClassName + (isTouched ? ' touched' : ''),
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
    <div className="flex flex-col">
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
