import React from 'react'

const styles = {
  label: 'mr-4',
  input: 'border border-solid border-black p-1',
}

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
      {label !== '' && (
        <label className={styles.label} htmlFor={name}>
          {label}
        </label>
      )}
      <input
        className={styles.input}
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
