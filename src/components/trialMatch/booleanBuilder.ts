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
  // group
  if (isGroup(node)) {
    const crit = Array.isArray(node.criteria) ? node.criteria : []
    const needsGrouping = crit.length > 1

    let joiner: 'AND' | 'OR'
    const opRaw = node && node.operator ? String(node.operator) : ''
    const opUpper = opRaw.toUpperCase()
    if (opUpper.includes('OR')) {
      joiner = 'OR'
    } else {
      joiner = 'AND'
    }

    if (needsGrouping) {
      acc.push({ kind: 'group-open', indent: indent })
    }

    for (let i = 0; i < crit.length; i++) {
      const beforeLen = acc.length
      nodeToLines(crit[i], indent + 16, acc, opts)

      const hasMore = i < crit.length - 1
      if (hasMore && acc.length > beforeLen) {
        const last = acc[acc.length - 1] as any
        last.trailingJoiner = joiner
      }
    }

    if (needsGrouping) {
      acc.push({ kind: 'group-close', indent: indent })
    }
    return
  }

  // leaf
  if (isLeaf(node)) {
    const rawFieldName = node && node.fieldName ? String(node.fieldName) : ''
    const fieldKeyNorm = canon(rawFieldName)
    const field = rawFieldName

    const opText = opPhrase(node ? node.operator : undefined)

    let rawValue: any
    if (node && node.fieldValueLabel != null) {
      rawValue = node.fieldValueLabel
    } else {
      rawValue = node ? node.fieldValue : undefined
    }

    const valueText = valueToDisplay(
      fieldKeyNorm,
      rawValue,
      opts && opts.formMap ? opts.formMap : undefined
    )

    let matched: boolean | undefined
    const hasIM = Object.prototype.hasOwnProperty.call(node, 'isMatched')
    const hasM = Object.prototype.hasOwnProperty.call(node, 'matched')
    if (hasIM || hasM) {
      const im = (node as any).isMatched
      const m = (node as any).matched
      matched = im !== undefined ? im : m
    } else {
      matched = undefined
    }

    acc.push({
      kind: 'leaf',
      indent: indent,
      field: field,
      opText: opText,
      valueText: valueText,
      matched: matched,
    })
    return
  }

  // array
  if (Array.isArray(node)) {
    for (let idx = 0; idx < node.length; idx++) {
      const ch = node[idx]
      nodeToLines(ch, indent, acc, opts)
    }
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
