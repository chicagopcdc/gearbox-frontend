import React, { useState, useEffect } from 'react'

type RadioProps = {
  label?: string
  name?: string
  options?: string[]
  disabled?: boolean
  required?: boolean
  value?: string
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

  useEffect(() => {
    if (value !== radioValue) setRadioValue(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  useEffect(() => {
    if (onChange && name) {
      onChange({
        target: {
          name,
          value: radioValue,
        },
      })
    }
  }, [name, onChange, radioValue])

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
            <div key={option}>
              <input
                {...attrs}
                className={optionClassName}
                id={option}
                name={name}
                type="radio"
                value={option}
                checked={option === radioValue}
                onChange={disabled ? undefined : () => setRadioValue(option)}
              />
              <label className="mx-2" htmlFor={option}>
                {option}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Radio
