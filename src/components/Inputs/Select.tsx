import React from 'react'
import Label from './Label'

const styles = {
  container: 'flex flex-col',
  input(dsiabled = false) {
    const baseClassName =
      'form-select rounded-none border border-solid border-black p-1 w-full'
    return dsiabled
      ? `${baseClassName} cursor-not-allowed bg-gray-200`
      : baseClassName
  },
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

function Select({
  label,
  name,
  options,
  placeholder,
  value = '',
  ...attr
}: SelectProps) {
  return (
    <div className={styles.container}>
      {label && <Label text={label} htmlFor={name || ''} />}
      <select
        {...attr}
        className={styles.input(attr.disabled)}
        id={name}
        name={name}
        value={value}
        style={{ minWidth: '200px' }}
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
}

export default Select
