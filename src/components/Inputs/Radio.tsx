import React, { useState } from 'react'
import { MatchFormFieldOption } from '../../model'

type RadioProps = {
  label?: string
  name?: string
  options?: MatchFormFieldOption[]
  disabled?: boolean
  required?: boolean
  value?: any
  onChange?(event: any): void
}

function Radio({
  label,
  name = '',
  options,
  disabled = false,
  value,
  onChange,
  ...attrs
}: RadioProps) {
  const [radioValue, setRadioValue] = useState(value || undefined)

  function handleChange(selected: MatchFormFieldOption[]) {
    setRadioValue(selected)
    if (onChange && name)
      onChange({ target: { name, value: selected || '', type: 'number' } })
  }

  const baseOptionClassName = 'border border-solid border-black p-1'
  const optionClassName = disabled
    ? `${baseOptionClassName} cursor-not-allowed bg-gray-200`
    : baseOptionClassName

  return (
    <div className="flex flex-col">
      {label && <label htmlFor={name}>{label}</label>}
      {options && (
        <div className="flex flex-wrap justify-between">
          {options.map((option) => (
            <div key={option.value}>
              <input
                {...attrs}
                className={optionClassName}
                id={option.value}
                name={name}
                type="radio"
                value={option.value}
                checked={option.value === radioValue}
                onChange={
                  disabled ? undefined : () => handleChange(option.value)
                }
              />
              <label className="mx-2" htmlFor={option.value}>
                {option.label}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Radio
