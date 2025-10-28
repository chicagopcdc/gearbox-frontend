// builds "boolean"

type Logic = 'all' | 'any'

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
  Object.prototype.hasOwnProperty.call(o as object, k)

// operator, words
function opPhrase(op?: string): string {
  switch ((op || '').toLowerCase()) {
    case 'gte':
      return 'is greater than/equal to'
    case 'lte':
      return 'is less than/equal to'
    case 'gt':
      return 'is greater than'
    case 'lt':
      return 'is less than'
    case 'eq':
      return 'is equal to'
    case 'in':
      return 'is one of the following:'
    default:
      return (op || '').trim()
  }
}

/* value mapping via formMap */

type FormMapEntry =
  | string
  | { label: string; options?: Record<string, string>; shortLabel?: string }
type FormMap = Record<string, FormMapEntry>

function getEntry(
  fieldKeyNorm: string,
  formMap?: FormMap
): FormMapEntry | undefined {
  if (!formMap) return undefined
  if (fieldKeyNorm in formMap) return formMap[fieldKeyNorm]
  for (const k of Object.keys(formMap))
    if (canon(k) === fieldKeyNorm) return (formMap as any)[k]
  return undefined
}

function valueToDisplay(
  fieldKeyNorm: string,
  raw: unknown,
  formMap?: FormMap
): string | undefined {
  if (raw == null || raw === '') return undefined
  const entry = getEntry(fieldKeyNorm, formMap)
  const rawStr = String(raw)
  if (entry && typeof entry === 'object' && entry.options) {
    // try exact, then numeric-normalized (so "113" matches "113.0")
    const byExact = entry.options[rawStr]
    const byNum = entry.options[String(Number(rawStr))]
    return byExact ?? byNum ?? rawStr
  }
  return rawStr
}

/* shape checks */

function isGroup(n: any): boolean {
  return !!n && typeof n === 'object' && Array.isArray(n.criteria)
}
function isLeaf(n: any): boolean {
  return !!n && typeof n === 'object' && 'fieldName' in n
}

/* walk to lines */

function nodeToLines(
  node: any,
  indent: number,
  acc: BoolLine[],
  opts?: { formMap?: FormMap }
): void {
  if (isGroup(node)) {
    const isOR = String(node.operator || '')
      .toUpperCase()
      .includes('OR')
    acc.push({ kind: 'group-open', indent })
    const crit = node.criteria || []
    for (let i = 0; i < crit.length; i++) {
      nodeToLines(crit[i], indent + 16, acc, opts)
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
    const fieldKeyNorm = canon(String(node.fieldName || ''))
    const field = String(node.fieldName || '')
    const opText = opPhrase(node.operator)
    const valueText = valueToDisplay(
      fieldKeyNorm,
      node.fieldValueLabel ?? node.fieldValue,
      opts?.formMap
    )

    const matched =
      has(node, 'isMatched') || has(node, 'matched')
        ? (node as any).isMatched ?? (node as any).matched
        : undefined

    acc.push({ kind: 'leaf', indent, field, opText, valueText, matched })
    return
  }

  if (Array.isArray(node)) {
    for (const ch of node) nodeToLines(ch, indent, acc, opts)
  }
}

/* public API */

export function buildBooleanRich(
  alg: any,
  opts?: {
    userSelectedByField?: UserSelected
    formMap?: FormMap
  }
): BoolLine[] {
  const root = alg?.eligibility ?? alg
  const lines: BoolLine[] = []
  if (!root) return lines

  if (root.inclusion)
    nodeToLines(root.inclusion, 0, lines, { formMap: opts?.formMap })
  if (root.exclusion)
    nodeToLines(root.exclusion, 0, lines, { formMap: opts?.formMap })

  return lines
}
