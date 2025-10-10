// booleanBuilder.ts
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
    default:
      return (op || '').trim()
  }
}

function quoteIfNeeded(v: unknown): string {
  if (v == null) return ''
  const s = String(v)
  return isFinite(Number(s)) && s.trim() !== '' ? s : `"${s}"`
}

function asBool(v: unknown): boolean | undefined {
  return typeof v === 'boolean' ? v : undefined
}

function isGroup(node: any): boolean {
  return node && Array.isArray(node.criteria)
}

type Leaf = {
  fieldName: string
  operator?: string
  fieldValue?: unknown
  fieldValueLabel?: string | null
  isMatched?: boolean
}

function isLeaf(node: any): node is Leaf {
  return !!node && typeof node === 'object' && 'fieldName' in node
}

function leafText(node: Leaf): string {
  const value =
    node.fieldValueLabel != null && String(node.fieldValueLabel).trim() !== ''
      ? node.fieldValueLabel
      : node.fieldValue != null
      ? String(node.fieldValue)
      : ''
  const rhs = value ? ` ${quoteIfNeeded(value)}` : ''
  const phrase = opPhrase(node.operator)
  return `${node.fieldName} ${phrase}${rhs}`
}

export type BooleanLine = {
  text: string
  indent: number
  kind: 'group-open' | 'group-close' | 'joiner' | 'leaf'
  matched?: boolean // only for leaves
}

export function buildBooleanLines(root: any): BooleanLine[] {
  const out: BooleanLine[] = []
  const INDENT = 8 // spaces per depth for plain-line output

  function push(
    text: string,
    depth: number,
    kind: BooleanLine['kind'],
    matched?: boolean
  ) {
    out.push({ text, indent: depth * INDENT, kind, matched })
  }

  function walk(node: any, depth = 0): void {
    if (!node) return

    if (isGroup(node)) {
      const isOR = String(node.operator || '')
        .toUpperCase()
        .includes('OR')
      const joiner = isOR ? 'OR' : 'AND'
      const children: any[] = node.criteria || []

      push('(', depth, 'group-open')

      children.forEach((child, idx) => {
        walk(child, depth + 1)
        if (idx < children.length - 1) {
          push(joiner, depth + 1, 'joiner')
        }
      })

      push(')', depth, 'group-close')
      return
    }

    if (isLeaf(node)) {
      push(leafText(node), depth, 'leaf', asBool(node.isMatched))
      return
    }

    if (typeof node === 'object') {
      Object.values(node).forEach((v) => walk(v, depth))
    }
  }

  walk(root, 0)
  return out
}

export type BooleanRichLine =
  | {
      kind: 'group-open' | 'group-close'
      indent: number
      trailingJoiner?: 'AND' | 'OR'
    }
  | {
      kind: 'leaf'
      indent: number
      field: string
      opText: string
      valueText?: string
      matched?: boolean
      trailingJoiner?: 'AND' | 'OR'
    }

export function buildBooleanRich(root: any): BooleanRichLine[] {
  const out: BooleanRichLine[] = []
  const INDENT = 24 // px per depth

  function walk(node: any, depth = 0): void {
    if (!node) return
    const indent = depth * INDENT

    if (isGroup(node)) {
      const isOR = String(node.operator || '')
        .toUpperCase()
        .includes('OR')
      const joiner: 'AND' | 'OR' = isOR ? 'OR' : 'AND'
      const children: any[] = node.criteria || []

      // opening paren
      out.push({ kind: 'group-open', indent })

      children.forEach((child, idx) => {
        // remember current length to find the last line produced by this child
        const before = out.length
        walk(child, depth + 1)

        // attach joiner to the LAST line emitted by this child (leaf or group-close)
        if (idx < children.length - 1) {
          const last = out[out.length - 1]
          if (last && (last.kind === 'leaf' || last.kind === 'group-close')) {
            last.trailingJoiner = joiner
          } else {
            // extremely defensive fallback (shouldn't happen)
            // out.push({ kind: 'joiner', indent: indent + INDENT, joiner })
          }
        }
      })

      // closing paren for this group
      out.push({ kind: 'group-close', indent })
      return
    }

    if (isLeaf(node)) {
      const rawValue =
        node.fieldValueLabel != null &&
        String(node.fieldValueLabel).trim() !== ''
          ? node.fieldValueLabel
          : node.fieldValue != null
          ? node.fieldValue
          : undefined

      out.push({
        kind: 'leaf',
        indent,
        field: node.fieldName,
        opText: opPhrase(node.operator),
        valueText: rawValue !== undefined ? quoteIfNeeded(rawValue) : undefined,
        matched: asBool(node.isMatched),
      })
      return
    }

    if (typeof node === 'object') {
      Object.values(node).forEach((v) => walk(v, depth))
    }
  }

  walk(root, 0)
  return out
}
