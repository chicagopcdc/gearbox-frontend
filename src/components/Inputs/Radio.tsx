import React, { useState, useEffect, Fragment } from 'react'
import Label from './Label'

const styles = {
  labelGroup: 'mr-2',
  label: 'mx-2',
  input: 'form-radio border border-solid border-black p-1 ml-2',
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
    <>
      {label && (
        <Label className={styles.labelGroup} text={label} htmlFor={name} />
      )}
      {options &&
        options.map((option) => (
          <Fragment key={option}>
            <input
              {...attrs}
              className={styles.input}
              id={option}
              name={name}
              type="radio"
              value={option}
              checked={option === value}
              onChange={disabled ? undefined : () => setRadioValue(option)}
            />
            <Label className={styles.label} text={option} htmlFor={option} />
          </Fragment>
        ))}
    </>
  )
}

export default Radio
