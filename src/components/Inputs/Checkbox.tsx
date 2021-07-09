import type React from 'react'

type CheckboxProps = {
  label?: string | React.ReactNode
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
  const checkboxAttrs = {
    ...attrs,
    className: 'rounded-none border border-solid border-black mr-4',
    id: name,
    name,
    type: 'checkbox',
    onChange: readOnly ? undefined : onChange,
  }
  return (
    <>
      <input {...checkboxAttrs} />
      {label && <label htmlFor={name}>{label}</label>}
    </>
  )
}

export default Checkbox
