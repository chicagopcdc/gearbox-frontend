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
  max?: number
  min?: number
  step?: number
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
  max,
  min,
  step,
  value,
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
        max={max}
        min={min}
        step={step}
        value={value}
        onChange={onChange}
      />
    </>
  )
}

export default TextField
