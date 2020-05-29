import React from 'react'
import Label from './Label'

const styles = {
  label: 'mr-4',
  input: 'border border-solid border-black p-1',
}

type SelectProps = {
  label?: string
  name?: string
  options: string[]
  disabled?: boolean
  placeholder?: string
  required?: boolean
  value?: string
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
}

const Select = ({
  label,
  name,
  options,
  disabled,
  required,
  placeholder,
  value,
  onChange,
}: SelectProps) => (
  <>
    {label && (
      <Label className={styles.label} text={label} htmlFor={name || ''} />
    )}
    <select
      className={styles.input}
      id={name}
      name={name}
      disabled={disabled}
      required={required}
      onChange={onChange}
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
  </>
)

export default Select
