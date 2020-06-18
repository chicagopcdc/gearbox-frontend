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
  min?: number
  max?: number
  step?: number
  value?: string | number
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

const TextField = ({
  label = '',
  name = '',
  type = 'text',
  ...attrs
}: TextFieldProps) => {
  return (
    <>
      {label && <Label className={styles.label} text={label} htmlFor={name} />}
      <input
        {...attrs}
        className={styles.input}
        id={name}
        name={name}
        type={type}
      />
    </>
  )
}

export default TextField
