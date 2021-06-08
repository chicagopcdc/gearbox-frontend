import type React from 'react'

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
  const baseClassName =
    'rounded-none border border-solid border-black p-1 block w-full resize-none'
  const disabledClassName = `${baseClassName} cursor-not-allowed bg-gray-200`
  const textAreaAttrs = {
    ...attrs,
    className: disabled || readOnly ? disabledClassName : baseClassName,
    disabled,
    id: name,
    name,
    readOnly,
    style: { minHeight: '100px' },
  }
  return (
    <>
      {label && <label htmlFor={name}>{label}</label>}
      <textarea {...textAreaAttrs} />
    </>
  )
}

export default Textarea
