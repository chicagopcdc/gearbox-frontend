import React from 'react'

type TextareaProps = {
  label?: string
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
  ...attrs
}: TextareaProps) {
  const baseTextareaClassName =
    'form-textarea rounded-none border border-solid border-black p-1 block w-full resize-none'
  const textAreaClassName =
    disabled || readOnly
      ? `${baseTextareaClassName} cursor-not-allowed bg-gray-200`
      : baseTextareaClassName
  return (
    <>
      {label && <label htmlFor={name}>{label}</label>}
      <textarea
        {...attrs}
        id={name}
        name={name}
        className={textAreaClassName}
        disabled={disabled}
        readOnly={readOnly}
        style={{ minHeight: '100px' }}
      />
    </>
  )
}

export default Textarea
