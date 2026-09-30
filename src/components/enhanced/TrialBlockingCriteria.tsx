type TrialBlockingCriteriaProps = {
  criteria: string[]
}

function TrialBlockingCriteria({ criteria }: TrialBlockingCriteriaProps) {
  if (criteria.length === 0) return null

  return (
    <div className="px-4 py-2 text-sm text-gray-600">
      <span className="text-red-600">⚠</span> Missing: {criteria.join(', ')}
    </div>
  )
}

export default TrialBlockingCriteria
