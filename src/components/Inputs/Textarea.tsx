import type React from 'react'

type TextareaProps = {
  label?: string | React.ReactNode
  name?: string
  disabled?: boolean
  placeholder?: string
  readOnly?: boolean
  required?: boolean
  value?: string | number
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>
}

function Textarea({
  label = '',
  name = '',
  disabled = false,
  readOnly = false,
  value,
  ...attrs
}: TextareaProps) {
  const className = disabled ? 'text-gray-400' : undefined

  const baseInputClassName =
    'rounded-none border border-solid border-black p-1 block w-full resize-none'
  const disabledInputClassName = `${baseInputClassName} cursor-not-allowed bg-gray-200 border-gray-400`
  const textAreaAttrs = {
    ...attrs,
    className:
      disabled || readOnly ? disabledInputClassName : baseInputClassName,
    disabled,
    id: name,
    name,
    readOnly,
    style: { minHeight: '100px' },
    // allow controlled textarea to "clear"
    value: attrs.onChange === undefined || value !== undefined ? value : '',
  }

  return (
    <div className={className}>
      {label && (
        <label className="mb-1" htmlFor={name}>
          {label}
        </label>
      )}
      <textarea {...textAreaAttrs} />
    </div>
  )
}

export default Textarea
