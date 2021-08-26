import type React from 'react'

type AgeInputProps = AgeFieldProps & {
  which: 'year' | 'month'
}

type AgeFieldProps = {
  label?: string | React.ReactNode
  name?: string
  readOnly?: boolean
  required?: boolean
  value?: number | ''
  onChange?(event: any): void
}

const MONTH_IN_YEAR = 12

function formatAge(value?: number | '') {
  let year
  let month

  if (value !== undefined && value !== '') {
    month = value

    if (month >= MONTH_IN_YEAR) {
      year = Math.floor(month / MONTH_IN_YEAR)
      month -= year * MONTH_IN_YEAR
    }
  }

  return { year, month }
}

function parseAge(age: { year?: number; month?: number }) {
  const { year, month } = age

  return year === undefined && month === undefined
    ? undefined
    : (year || 0) * MONTH_IN_YEAR + (month || 0)
}

function AgeInput({ name, value, which, onChange, ...attrs }: AgeInputProps) {
  const isPlural = value !== undefined && value > 1
  const inputClassName = 'rounded-none border border-solid border-black p-1'
  const unitClassName = isPlural ? 'pl-2 pr-3' : 'pl-2 pr-4'
  return (
    <div className="inline-block mb-1">
      <input
        {...attrs}
        className={inputClassName}
        value={value}
        id={which}
        name={name}
        type="number"
        min={0}
        onChange={onChange}
        style={{ maxWidth: '5rem' }}
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
  const age = formatAge(value)
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>,
    which: 'year' | 'month'
  ) {
    if (onChange) {
      const newWhich =
        e.target.value === '' ? undefined : parseInt(e.target.value)
      const newValue = parseAge({ ...age, [which]: newWhich })?.toString()
      onChange({ target: { name, value: newValue, type: 'number' } })
    }
  }

  return (
    <>
      {label && (
        <label className="mb-1" htmlFor={name}>
          {label}
        </label>
      )}
      <div className="flex flex-wrap justify-between items-center">
        <AgeInput
          {...attrs}
          value={age.year || ''}
          which="year"
          onChange={(e) => handleChange(e, 'year')}
        />
        <AgeInput
          {...attrs}
          value={age.month || ''}
          which="month"
          onChange={(e) => handleChange(e, 'month')}
        />
        <div className="text-sm text-gray-400 text-right italic">
          {value !== undefined && value !== ''
            ? `Total ${value} ${value < 2 ? 'month' : 'months'}`
            : `Total ?? month`}
        </div>
      </div>
    </>
  )
}

export default AgeField
