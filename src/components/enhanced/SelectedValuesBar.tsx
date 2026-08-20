import { getFieldOptionLabelMap } from '../../utils'
import type { MatchFormFieldConfig, MatchFormValues } from '../../model'

type SelectedValuesBarProps = {
  fields: MatchFormFieldConfig[]
  values: MatchFormValues
  onClearField: (id: number) => void
}

function SelectedValuesBar({
  fields,
  values,
  onClearField,
}: SelectedValuesBarProps) {
  const fieldOptionLabelMap = getFieldOptionLabelMap(fields)

  const filledFields = fields.filter(
    (field) => values[field.id] !== undefined && values[field.id] !== ''
  )

  if (filledFields.length === 0) {
    return (
      <div className="border border-gray-300 bg-white">
        <h3 className="text-sm font-medium px-4 py-2 border-b border-gray-300">
          Selected Values
        </h3>
        <div className="p-4 text-gray-500 text-sm italic">
          No fields filled yet. Search or select from the form below.
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-300 bg-white">
      <h3 className="text-sm font-medium px-4 py-2 border-b border-gray-300">
        Selected Values
      </h3>
      <div className="p-4 flex flex-wrap gap-2">
        {filledFields.map((field) => {
          const fieldValue = values[field.id]
          const fieldLabel = field.label || field.name

          let displayValue: string
          if (
            field.options &&
            fieldOptionLabelMap[field.id] &&
            fieldOptionLabelMap[field.id][fieldValue as number]
          ) {
            displayValue = fieldOptionLabelMap[field.id][fieldValue as number]
          } else {
            displayValue = String(fieldValue)
          }

          return (
            <div
              key={field.id}
              className="inline-flex items-center gap-2 bg-gray-200 px-3 py-1 border border-solid border-gray-300"
            >
              <span className="text-sm">
                {fieldLabel}: {displayValue}
              </span>
              <button
                type="button"
                onClick={() => onClearField(field.id)}
                className="text-gray-600 hover:text-black font-bold"
                aria-label={`Clear ${fieldLabel}`}
              >
                ×
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SelectedValuesBar
