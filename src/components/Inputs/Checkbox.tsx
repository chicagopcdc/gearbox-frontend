import React from 'react'

type CheckboxProps = {
  label?: string
  name?: string
  checked?: boolean
  readOnly?: boolean
  required?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

function Checkbox({
  label = '',
  name = '',
  readOnly,
  onChange,
  ...attrs
}: CheckboxProps) {
  return (
    <>
      <input
        {...attrs}
        className="form-checkbox rounded-none border border-solid border-black mr-4"
        type="checkbox"
        id={name}
        name={name}
        onChange={readOnly ? () => false : onChange}
      />
      {label && <label htmlFor={name}>{label}</label>}
    </>
  )
}

export default Checkbox
