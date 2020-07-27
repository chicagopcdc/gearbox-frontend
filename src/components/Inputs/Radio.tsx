import React, { useState, useEffect } from 'react'
import Label from './Label'

const styles = {
  container: 'sm:flex sm:items-center',
  label: 'sm:w-1/2 mr-4',
  options: 'sm:w-1/2 flex flex-wrap justify-between',
  optionLabel: 'mx-2',
  optionInput: 'form-radio border border-solid border-black p-1',
}

type RadioProps = {
  label?: string
  name?: string
  options?: string[]
  disabled?: boolean
  required?: boolean
  value?: string
  onChange?(event: any): void
}

const Radio = ({
  label,
  name = '',
  options,
  disabled,
  value,
  onChange,
  ...attrs
}: RadioProps) => {
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

  return (
    <div className={styles.container}>
      {label && <Label className={styles.label} text={label} htmlFor={name} />}
      {options && (
        <div className={styles.options}>
          {options.map((option) => (
            <div key={option}>
              <input
                {...attrs}
                className={styles.optionInput}
                id={option}
                name={name}
                type="radio"
                value={option}
                checked={option === radioValue}
                onChange={disabled ? undefined : () => setRadioValue(option)}
              />
              <Label
                className={styles.optionLabel}
                text={option}
                htmlFor={option}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Radio
