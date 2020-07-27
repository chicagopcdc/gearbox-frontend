import React from 'react'
import Label from './Label'

const styles = {
  container: 'sm:flex sm:items-center',
  label: 'sm:w-1/2 mr-4',
  input:
    'form-select rounded-none border border-solid border-black p-1 w-full sm:w-1/2',
}

type SelectProps = {
  label?: string
  name?: string
  options: string[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
  value?: string
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
}

const Select = ({
  label,
  name,
  options,
  placeholder,
  value = '',
  ...attr
}: SelectProps) => (
  <div className={styles.container}>
    {label && (
      <Label className={styles.label} text={label} htmlFor={name || ''} />
    )}
    <select
      {...attr}
      className={styles.input}
      id={name}
      name={name}
      value={value}
      style={{
        minWidth: '200px',
      }}
    >
      {placeholder && (
        <option value="" hidden>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
)

export default Select
