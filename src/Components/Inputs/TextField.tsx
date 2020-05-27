import React from 'react'
import Label from './Label'

type TextFieldProps = {
  label?: string
  name?: string
  type?: 'text' | 'password' | 'number'
  placeholder?: string
  required?: boolean
  value?: string | number
  numberAttrs?: {
    max?: number
    min?: number
    step?: number
  }
  onChange?: React.ChangeEventHandler
}

const TextField = ({
  label = '',
  name = '',
  type = 'text',
  placeholder,
  required,
  value,
  numberAttrs,
  onChange,
}: TextFieldProps) => {
  return (
    <>
      {label && <Label text={label} htmlFor={name} />}
      <input
        className="border border-solid border-black p-1"
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        {...(type === 'number' && numberAttrs)}
      />
    </>
  )
}

export default TextField
