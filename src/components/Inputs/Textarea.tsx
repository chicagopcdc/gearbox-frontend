import React from 'react'

const styles = {
  input(disabled = false, readOnly = false) {
    const baseClassName =
      'form-textarea rounded-none border border-solid border-black p-1 block w-full resize-none'
    return disabled || readOnly
      ? `${baseClassName} cursor-not-allowed bg-gray-200`
      : baseClassName
  },
}

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

function Textarea({ label = '', name = '', ...attrs }: TextareaProps) {
  return (
    <>
      {label && <label htmlFor={name}>{label}</label>}
      <textarea
        {...attrs}
        className={styles.input(attrs.disabled, attrs.readOnly)}
        id={name}
        name={name}
        style={{ minHeight: '100px' }}
      />
    </>
  )
}

export default Textarea
