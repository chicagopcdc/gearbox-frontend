import type { MatchInfo, MatchInfoAlgorithm } from '../../model'

const isMatchAlgorithm = (
  matchInfoOrAlgo: MatchInfo | MatchInfoAlgorithm
): matchInfoOrAlgo is MatchInfoAlgorithm => {
  return Object.prototype.hasOwnProperty.call(matchInfoOrAlgo, 'criteria')
}

export function getBlockingCriteria(
  matchInfoAlgorithm: MatchInfoAlgorithm,
  limit = 2
): string[] {
  const fieldNames: string[] = []
  const seen = new Set<string>()

  function walk(node: MatchInfo | MatchInfoAlgorithm) {
    if (fieldNames.length >= limit) return

    if (isMatchAlgorithm(node)) {
      for (const criterion of node.criteria) {
        walk(criterion)
        if (fieldNames.length >= limit) return
      }
    } else {
      if (node.isMatched === undefined && !seen.has(node.fieldName)) {
        seen.add(node.fieldName)
        fieldNames.push(node.fieldName)
      }
    }
  }

  walk(matchInfoAlgorithm)
  return fieldNames
}
