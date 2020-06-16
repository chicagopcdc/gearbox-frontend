import React from 'react'
import Label from './Label'

type CheckboxProps = {
  label?: string
  name?: string
  readOnly?: boolean
  required?: boolean
  checked?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

const Checkbox = ({
  label = '',
  name = '',
  readOnly,
  required,
  checked,
  onChange,
}: CheckboxProps) => (
  <>
    <input
      className="mr-4"
      id={name}
      name={name}
      type="checkbox"
      required={required}
      checked={checked}
      onChange={readOnly ? () => false : onChange}
    />
    {label && <Label text={label} htmlFor={name} />}
  </>
)

export default Checkbox
