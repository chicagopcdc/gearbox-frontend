import type { MatchFormFieldOption } from '../../model'

type RadioProps = {
  label?: string | React.ReactNode
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
  function handleChange(selected: MatchFormFieldOption[]) {
    if (onChange && name)
      onChange({ target: { name, value: selected || '', type: 'number' } })
  }

  const baseClassName = 'flex flex-col'
  const disabledClassName = `${baseClassName} text-gray-400`
  const className = disabled ? disabledClassName : baseClassName

  const baseOptionClassName = 'border border-solid border-black p-1'
  const optionClassName = disabled
    ? `${baseOptionClassName} cursor-not-allowed bg-gray-200 border-gray-400`
    : baseOptionClassName

  return (
    <div className={className}>
      {label && (
        <label className="mb-1" id={`${name}-group`}>
          {label}
        </label>
      )}
      {options && (
        <div
          className="flex flex-wrap justify-between"
          aria-labelledby={`${name}-group`}
        >
          {options.map((option) => (
            <div key={option.value}>
              <input
                {...attrs}
                className={optionClassName}
                id={`${name}-${option.value}`}
                name={name}
                type="radio"
                value={option.value}
                checked={value !== undefined && option.value === value}
                onChange={
                  disabled ? undefined : () => handleChange(option.value)
                }
                readOnly={disabled}
              />
              <label className="mx-2" htmlFor={`${name}-${option.value}`}>
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
