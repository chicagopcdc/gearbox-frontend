import { isMatchFormValueFilled } from '../../utils'
import { getPatientDisplayValue } from '../../patientDisplayValues'
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
  const filledFields = fields.filter((field) =>
    isMatchFormValueFilled(values[field.id])
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

          const patientDisplayValue = getPatientDisplayValue(
            fieldValue,
            field.options
          )

          let displayValue: string

          if (Array.isArray(patientDisplayValue)) {
            const labels = patientDisplayValue.map(String)
            const visibleLabels = labels.slice(0, 3)
            const remainingCount = labels.length - visibleLabels.length

            displayValue =
              remainingCount > 0
                ? `${visibleLabels.join(', ')} +${remainingCount} more`
                : visibleLabels.join(', ')
          } else {
            displayValue = String(patientDisplayValue)
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
