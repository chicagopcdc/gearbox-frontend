import React, { useEffect, useState } from 'react'

type AgeInputProps = AgeFieldProps & {
  which: 'year' | 'month' | 'day'
}

type AgeFieldProps = {
  label?: string
  name?: string
  readOnly?: boolean
  required?: boolean
  value?: number | ''
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

const DAY_IN_YEAR = 365
const DAY_IN_MONTH = 30

function formatAge(value?: number | '') {
  let year
  let month
  let day

  if (value !== undefined && value !== '') {
    day = value

    if (day >= DAY_IN_YEAR) {
      year = Math.floor(day / DAY_IN_YEAR)
      month = 0
      day -= year * DAY_IN_YEAR
    }

    if (day >= DAY_IN_MONTH) {
      month = Math.floor(day / DAY_IN_MONTH)
      day -= month * DAY_IN_MONTH
    }
  }

  return { year, month, day }
}

function parseAge(age: { year?: number; month?: number; day?: number }) {
  const { year, month, day } = age

  return year === undefined && month === undefined && day === undefined
    ? undefined
    : (year || 0) * DAY_IN_YEAR + (month || 0) * DAY_IN_MONTH + (day || 0)
}

function AgeInput({ name, value, which, onChange, ...attrs }: AgeInputProps) {
  const isPlural = value !== undefined && value > 1
  const inputClassName = 'rounded-none border border-solid border-black p-1'
  const unitClassName = isPlural ? 'pl-2 pr-3' : 'pl-2 pr-4'
  return (
    <div className="inline-block pb-2">
      <input
        {...attrs}
        className={inputClassName}
        value={value}
        id={which}
        name={name}
        type="number"
        min={0}
        size={5}
        onChange={onChange}
      />
      <span className={unitClassName}>
        {isPlural ? `${which}s` : `${which} `}
      </span>
    </div>
  )
}

function AgeField({
  label = '',
  name = '',
  value,
  onChange,
  ...attrs
}: AgeFieldProps) {
  const [age, setAge] = useState(formatAge(value))

  useEffect(() => {
    const newAge = formatAge(value)
    if (
      age.year !== newAge.year ||
      age.month !== newAge.month ||
      age.day !== newAge.day
    )
      setAge(newAge)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  useEffect(() => {
    const newValue = parseAge(age)
    if (onChange && value !== newValue)
      onChange({
        target: {
          name,
          value: newValue !== undefined ? newValue.toString() : undefined,
          type: 'number',
        },
      } as React.ChangeEvent<HTMLInputElement>)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [age])

  return (
    <>
      {label && <label htmlFor={name}>{label}</label>}
      <div>
        <AgeInput
          {...attrs}
          value={age.year}
          which="year"
          onChange={({ target: { value } }) =>
            setAge((prevAge) => ({
              ...prevAge,
              year: value === '' ? undefined : parseInt(value),
            }))
          }
        />
        <AgeInput
          {...attrs}
          value={age.month}
          which="month"
          onChange={({ target: { value } }) =>
            setAge((prevAge) => ({
              ...prevAge,
              month: value === '' ? undefined : parseInt(value),
            }))
          }
        />
        <AgeInput
          {...attrs}
          value={age.day}
          which="day"
          onChange={({ target: { value } }) =>
            setAge((prevAge) => ({
              ...prevAge,
              day: value === '' ? undefined : parseInt(value),
            }))
          }
        />
      </div>
    </>
  )
}

export default AgeField
