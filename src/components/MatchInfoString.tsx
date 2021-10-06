import { CheckCircle, XCircle } from 'react-feather'
import type { ComparisonOperator, MatchInfo } from '../model'

function getOperatorString(operator: ComparisonOperator) {
  switch (operator) {
    case 'eq':
      return 'is equal to'
    case 'gt':
      return 'is greater than'
    case 'gte':
      return 'is greater than/equal to'
    case 'lt':
      return 'is less than'
    case 'lte':
      return 'is less than/equal to'
    case 'ne':
      return 'is not'
    case 'in':
      return 'is one of'
  }
}

function getValueString(fieldValue: any): string {
  if (Array.isArray(fieldValue))
    return `[${fieldValue.map(getValueString).join(', ')}]`

  return typeof fieldValue === 'number' ? `${fieldValue}` : `"${fieldValue}"`
}

function MatchInfoString({
  fieldName,
  fieldValue,
  fieldValueLabel,
  isMatched,
  operator,
}: MatchInfo) {
  const operatorString = getOperatorString(operator)
  const valueString = getValueString(fieldValueLabel ?? fieldValue)
  const valueStringClassName =
    isMatched === undefined
      ? 'text-gray-700'
      : isMatched
      ? 'text-green-700'
      : 'text-red-700'
  const matchIcon =
    isMatched === undefined ? null : isMatched ? (
      <CheckCircle className="inline mx-1" size="1em" />
    ) : (
      <XCircle className="inline mx-1" size="1em" />
    )

  return (
    <>
      {fieldName} <span className="italic text-gray-500">{operatorString}</span>{' '}
      <span className={valueStringClassName}>
        {valueString}
        {matchIcon}
      </span>
    </>
  )
}

export default MatchInfoString
