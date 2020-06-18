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
  ...attr
}: SelectProps) => (
  <>
    {label && (
      <Label className={styles.label} text={label} htmlFor={name || ''} />
    )}
    <select
      {...attr}
      className={styles.input}
      id={name}
      name={name}
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
