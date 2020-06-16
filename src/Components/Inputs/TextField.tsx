import React from 'react'
import Label from './Label'

const styles = {
  label: 'mr-4',
  input: 'border border-solid border-black p-1',
}

type TextFieldProps = {
  label?: string
  name?: string
  type?: 'text' | 'password' | 'number'
  autoFocus?: boolean
  placeholder?: string
  readOnly?: boolean
  required?: boolean
  value?: string | number
  numberAttrs?: {
    max?: number
    min?: number
    step?: number
  }
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

const TextField = ({
  label = '',
  name = '',
  type = 'text',
  autoFocus,
  placeholder,
  readOnly,
  required,
  value,
  numberAttrs,
  onChange,
}: TextFieldProps) => {
  return (
    <>
      {label && <Label className={styles.label} text={label} htmlFor={name} />}
      <input
        className={styles.input}
        id={name}
        name={name}
        type={type}
        autoFocus={autoFocus}
        placeholder={placeholder}
        readOnly={readOnly}
        required={required}
        value={value}
        onChange={onChange}
        {...(type === 'number' && numberAttrs)}
      />
    </>
  )
}

export default TextField
