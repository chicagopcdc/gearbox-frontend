import React from 'react'
import Label from './Label'

type CheckboxProps = {
  label?: string
  name?: string
  placeholder?: string
  readonly?: boolean
  required?: boolean
  checked?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

const Checkbox = ({
  label = '',
  name = '',
  readonly,
  required,
  checked,
  onChange,
}: CheckboxProps) => {
  if (readonly) onChange = () => false

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
