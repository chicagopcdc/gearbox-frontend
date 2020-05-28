import React from 'react'
import Label from './Label'

type CheckboxProps = {
  label?: string
  name?: string
  placeholder?: string
  required?: boolean
  checked?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

const Checkbox = ({
  label = '',
  name = '',
  required,
  checked,
  onChange,
}: CheckboxProps) => {
  return (
    <>
      <input
        className="mr-4"
        id={name}
        name={name}
        type="checkbox"
        required={required}
        checked={checked}
        onChange={onChange}
      />
      {label && <Label text={label} htmlFor={name} />}
    </>
  )
}

export default Checkbox
