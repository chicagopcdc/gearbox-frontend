import React from 'react'
import Label from './Label'

type CheckboxProps = {
  label?: string
  name?: string
  checked?: boolean
  readOnly?: boolean
  required?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

const Checkbox = ({
  label = '',
  name = '',
  readOnly,
  onChange,
  ...attrs
}: CheckboxProps) => (
  <>
    <input
      {...attrs}
      className="mr-4"
      type="checkbox"
      id={name}
      name={name}
      onChange={readOnly ? () => false : onChange}
    />
    {label && <Label text={label} htmlFor={name} />}
  </>
)

export default Checkbox
