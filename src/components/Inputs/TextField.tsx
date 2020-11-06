import React from 'react'
import Label from './Label'

const styles = {
  container: 'flex flex-col',
  input(readOnly = false) {
    const baseClassName =
      'form-input rounded-none border border-solid border-black p-1 w-full'
    return readOnly
      ? `${baseClassName} cursor-not-allowed bg-gray-200`
      : baseClassName
  },
}

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
  ...attrs
}: TextFieldProps) {
  return (
    <div className={styles.container}>
      {label && <Label text={label} htmlFor={name} />}
      <input
        {...attrs}
        className={styles.input(attrs.readOnly)}
        id={name}
        name={name}
        value={value}
        type={type}
      />
    </div>
  )
}

export default TextField
