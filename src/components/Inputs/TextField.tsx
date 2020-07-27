import React from 'react'
import Label from './Label'

const styles = {
  container: 'sm:flex sm:items-center',
  label: 'sm:w-1/2 mr-4',
  input:
    'form-input rounded-none border border-solid border-black p-1 w-full sm:w-1/2',
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

const TextField = ({
  label = '',
  name = '',
  type = 'text',
  value = '',
  ...attrs
}: TextFieldProps) => {
  return (
    <div className={styles.container}>
      {label && <Label className={styles.label} text={label} htmlFor={name} />}
      <input
        {...attrs}
        className={styles.input}
        id={name}
        name={name}
        value={value}
        type={type}
      />
    </div>
  )
}

export default TextField
