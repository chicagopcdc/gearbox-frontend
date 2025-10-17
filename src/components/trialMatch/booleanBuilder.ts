// builds "boolean" lines; can color leaves using user selections

export type BoolLine =
  | { kind: 'group-open'; indent: number }
  | { kind: 'group-close'; indent: number; trailingJoiner?: 'AND' | 'OR' }
  | {
      kind: 'leaf'
      indent: number
      field: string
      opText: string
      valueText?: string
      matched?: boolean
      trailingJoiner?: 'AND' | 'OR'
    }

type UserSelected = Record<
  string,
  { kind: 'label' | 'number'; value: string | number }
>

// normalize simple strings
const canon = (s?: string | null) =>
  String(s ?? '')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()

// safe hasOwnProperty
const has = (o: unknown, k: PropertyKey): boolean =>
  Object.prototype.hasOwnProperty.call(o, k)

// operator, words
function opPhrase(op?: string): string {
  switch ((op || '').toLowerCase()) {
    case 'gte':
      return 'is greater than or equal to'
    case 'lte':
      return 'is less than or equal to'
    case 'gt':
      return 'is greater than'
    case 'lt':
      return 'is less than'
    case 'eq':
      return 'is equal to'
    case 'in':
      return 'is one of'
    case 'nin':
      return 'is not one of'
    default:
      return (op || '').trim()
  }
}

// compare a leaf with user's chosen value
function evaluateAgainstUserAnswer(
  fieldLabel: string,
  opText: string | undefined,
  leafValueText: string | undefined,
  selected: UserSelected | undefined
): boolean | undefined {
  if (!selected) return undefined
  const key = canon(fieldLabel)
  const chosen = selected[key]
  if (!chosen) return undefined

  const t = (opText ?? '').toLowerCase()
  const op: 'eq' | 'in' | 'gte' | 'lte' | 'gt' | 'lt' | undefined = t.includes(
    'one of'
  )
    ? 'in'
    : t.includes('greater than or equal')
    ? 'gte'
    : t.includes('less than or equal')
    ? 'lte'
    : t.includes('greater than')
    ? 'gt'
    : t.includes('less than')
    ? 'lt'
    : t.includes('equal')
    ? 'eq'
    : undefined

  if (!op) return undefined

  if (chosen.kind === 'label') {
    if (!leafValueText) return undefined
    return canon(String(chosen.value)) === canon(leafValueText)
  }
  if (chosen.kind === 'number') {
    const n = Number(chosen.value)
    const leafN = Number(
      (leafValueText ?? '').toString().replace(/[^0-9.+-]/g, '')
    )
    if (!Number.isFinite(n) || !Number.isFinite(leafN)) return undefined
    switch (op) {
      case 'gte':
        return n >= leafN
      case 'lte':
        return n <= leafN
      case 'gt':
        return n > leafN
      case 'lt':
        return n < leafN
      case 'eq':
        return n === leafN
      default:
        return undefined
    }
  }
  return undefined
}

// shape checks
function isGroup(n: any): boolean {
  return !!n && typeof n === 'object' && Array.isArray(n.criteria)
}
function isLeaf(n: any): boolean {
  return !!n && typeof n === 'object' && 'fieldName' in n
}

// value text resolver (keeps label if present)
function valueToText(
  fieldValue: any,
  fieldValueLabel?: any
): string | undefined {
  const raw =
    fieldValueLabel != null && String(fieldValueLabel).trim() !== ''
      ? fieldValueLabel
      : fieldValue != null
      ? fieldValue
      : ''
  return raw === '' ? undefined : String(raw)
}

// walk a node into lines (keeps indent and AND/OR)
function nodeToLines(node: any, indent: number, acc: BoolLine[]): void {
  if (isGroup(node)) {
    const isOR = String(node.operator || '')
      .toUpperCase()
      .includes('OR')
    acc.push({ kind: 'group-open', indent })
    const crit = node.criteria || []
    for (let i = 0; i < crit.length; i++) {
      nodeToLines(crit[i], indent + 16, acc)
      const hasMore = i < crit.length - 1
      if (hasMore) {
        acc.push({
          kind: 'group-close',
          indent: indent + 16,
          trailingJoiner: isOR ? 'OR' : 'AND',
        })
        acc.push({ kind: 'group-open', indent: indent + 16 })
      }
    }
    acc.push({ kind: 'group-close', indent })
    return
  }

  if (isLeaf(node)) {
    const field = String(node.fieldName || '')
    const opText = opPhrase(node.operator)
    const valueText = valueToText(node.fieldValue, node.fieldValueLabel)
    const matched =
      has(node, 'isMatched') || has(node, 'matched')
        ? (node as any).isMatched ?? (node as any).matched
        : undefined

    acc.push({ kind: 'leaf', indent, field, opText, valueText, matched })
    return
  }

  if (Array.isArray(node)) {
    for (const ch of node) nodeToLines(ch, indent, acc)
  }
}

// build lines; optionally apply user selections for matched coloring
export function buildBooleanRich(
  alg: any,
  opts?: { userSelectedByField?: UserSelected }
): BoolLine[] {
  const root = alg?.eligibility ?? alg
  const lines: BoolLine[] = []
  if (!root) return lines

  if (root.inclusion) nodeToLines(root.inclusion, 0, lines)
  if (root.exclusion) nodeToLines(root.exclusion, 0, lines)

  if (opts?.userSelectedByField) {
    for (const ln of lines) {
      if (ln.kind !== 'leaf') continue
      const m = evaluateAgainstUserAnswer(
        ln.field,
        ln.opText,
        ln.valueText,
        opts.userSelectedByField
      )
      if (typeof m === 'boolean') ln.matched = m
    }
  }

  return lines
}
