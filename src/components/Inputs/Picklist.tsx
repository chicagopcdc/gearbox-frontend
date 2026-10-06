import type { MatchFormFieldOption } from '../../model'
import MultiSelect from './MultiSelect'

type PicklistChangeEvent = {
  target: {
    name: string
    value: number[]
  }
}

type PicklistProps = {
  label?: string
  name: string
  options: MatchFormFieldOption[]
  value?: number[]
  disabled?: boolean
  className?: string
  onChange?(event: PicklistChangeEvent): void
}

function Picklist({
  label,
  name,
  options,
  value = [],
  disabled,
  className,
  onChange,
}: PicklistProps) {
  const selectedValueIds = new Set(value.map(Number))

  const selectedOptions = options.filter((option) =>
    selectedValueIds.has(Number(option.value))
  )

  const handleChange = (nextOptions: MatchFormFieldOption[]) => {
    onChange?.({
      target: {
        name,
        value: nextOptions.map((option) => Number(option.value)),
      },
    })
  }

  return (
    <MultiSelect
      label={label}
      name={name}
      options={options}
      value={selectedOptions}
      disabled={disabled}
      className={className}
      onChange={handleChange}
      isCreatable={false}
      hasSelectAll={false}
      closeOnChangedValue={false}
    />
  )
}

export default Picklist
