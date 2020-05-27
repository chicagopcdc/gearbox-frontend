import React from 'react'
import Label from './Label'

type TextFieldProps = {
  label?: string
  name?: string
  type?: 'text' | 'password' | 'number'
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
        onChange={onChange}
        value={value}
        {...(type === 'number' && numberAttrs)}
      />
    </>
  )
}

export default TextField
