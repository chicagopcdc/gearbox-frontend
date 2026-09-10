import type { MatchFormFieldConfig, ImportantQuestionConfig } from '../../model'

type QuickSelectProps = {
  fields: MatchFormFieldConfig[]
  importantQuestionsConfig: ImportantQuestionConfig
  onSelectField: (id: number) => void
}

function QuickSelect({
  fields,
  importantQuestionsConfig,
  onSelectField,
}: QuickSelectProps) {
  const importantFields = fields.filter((field) =>
    importantQuestionsConfig.groups.some(
      (importantGroup) => importantGroup.name === field.name
    )
  )

  if (importantFields.length === 0) return null

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Quick Select</h3>
      <div className="flex flex-wrap gap-2">
        {importantFields.map((field) => (
          <button
            key={field.id}
            type="button"
            onClick={() => onSelectField(field.id)}
            className="border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-100"
          >
            {field.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickSelect
