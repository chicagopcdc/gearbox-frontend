// Builds outline sections from an eligibility tree and the form map/group names.
// - Groups leaves by form group; orders sections by match_form group order.
// - Collapses simple OR-of-same-field choices into a parent with child bullets.
// - Propagates matched from leaves to determine section status.

type Logic = 'all' | 'any'

export type Item = {
  text?: string
  matched?: boolean
  logic?: Logic
  children?: Item[]

  _group?: string
  field?: string
  opText?: string
  valueText?: string
}

export type Section = {
  id: string
  title: string
  status: 'met' | 'not_met' | 'unknown'
  items: Item[]
}

type FormMapEntry =
  | string
  | {
      label: string
      options?: Record<string, string>
      shortLabel?: string
      section?: string
    }

type FormMap = Record<string, FormMapEntry>

type BuildOpts = {
  formMap?: FormMap
  groupNames?: Record<string, string>
}

/* helpers */

function canon(s: string | undefined | null): string {
  return String(s ?? '')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function titleCase(s: string): string {
  return s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1))
}

function slugify(s: string): string {
  return canon(s).replace(/[^\w]+/g, '-')
}

function normalizeMatched(x: any): boolean | undefined {
  return x === true ? true : x === false ? false : undefined
}

function getEntry(
  fieldKey: string | undefined,
  formMap?: FormMap
): FormMapEntry | undefined {
  if (!fieldKey || !formMap) return undefined
  const key = canon(fieldKey)
  if (key in formMap) return formMap[key]
  for (const k of Object.keys(formMap)) {
    if (canon(k) === key) return (formMap as any)[k]
  }
  return undefined
}

function fieldToText(fieldKeyNorm: string, formMap?: FormMap): string {
  const e = getEntry(fieldKeyNorm, formMap)
  if (typeof e === 'string') return fieldKeyNorm
  if (e && typeof e === 'object' && e.label) return e.label
  return fieldKeyNorm
}

function valueToText(
  value: any,
  fieldKeyNorm: string,
  formMap?: FormMap
): string {
  const e = getEntry(fieldKeyNorm, formMap)
  if (e && typeof e === 'object' && e.options) {
    if (Array.isArray(value))
      return value.map((v) => e.options![String(v)] ?? String(v)).join(', ')
    return e.options[String(value)] ?? String(value)
  }
  if (Array.isArray(value)) return value.map(String).join(', ')
  return String(value)
}

function sectionForField(fieldKeyNorm: string, formMap?: FormMap): string {
  const e = getEntry(fieldKeyNorm, formMap)
  if (typeof e === 'string') return e
  if (e && typeof e === 'object') return e.section || e.label || 'Eligibility'
  return 'Eligibility'
}

function liftMatchedFromChildren(children: Item[]): boolean | undefined {
  let sawTrue = false
  let sawFalse = false
  for (const ch of children) {
    if (ch.matched === true) sawTrue = true
    else if (ch.matched === false) sawFalse = true
  }
  if (sawFalse) return false
  if (sawTrue) return true
  return undefined
}

function sectionStatus(items: Item[]): 'met' | 'not_met' | 'unknown' {
  const m = liftMatchedFromChildren(items)
  if (m === true) return 'met'
  if (m === false) return 'not_met'
  return 'unknown'
}

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

// matcher shape
// Group node: { operator, criteria: [...] }
// Leaf node:  { fieldName, operator, fieldValue?, fieldValueLabel?, isMatched?/matched? }
function isCriteriaGroup(node: any): boolean {
  return !!node && typeof node === 'object' && Array.isArray(node.criteria)
}
function isLeaf(node: any): boolean {
  return !!node && typeof node === 'object' && 'fieldName' in node
}

function leafToItem(node: any, formMap?: FormMap): Item {
  const fieldKeyNorm = canon(String(node.fieldName || ''))
  const lhs = fieldToText(fieldKeyNorm, formMap)
  const op = opPhrase(node.operator)
  const rawValue =
    node.fieldValueLabel != null && String(node.fieldValueLabel).trim() !== ''
      ? node.fieldValueLabel
      : node.fieldValue != null
      ? node.fieldValue
      : ''
  const rhs =
    rawValue !== '' ? valueToText(rawValue, fieldKeyNorm, formMap) : ''

  const grp = sectionForField(fieldKeyNorm, formMap)

  const hasIsMatched = Object.prototype.hasOwnProperty.call(node, 'isMatched')
  const hasMatched = Object.prototype.hasOwnProperty.call(node, 'matched')
  const matchedRaw = hasIsMatched
    ? node.isMatched
    : hasMatched
    ? node.matched
    : undefined
  const matched =
    matchedRaw === true ? true : matchedRaw === false ? false : undefined

  return {
    field: lhs,
    opText: op,
    valueText: rhs !== '' ? String(rhs) : undefined,

    text: rhs !== '' ? `${lhs} ${op} ${rhs}` : `${lhs} ${op}`,

    matched,
    _group: grp,
  }
}

/**
 * Collapses OR groups where all children are simple equals on the same field.
 * Produces a parent item with a child list of values.
 */
function tryCollapseSameFieldOR(node: any, formMap?: FormMap): Item[] | null {
  if (!isCriteriaGroup(node)) return null
  const isOR = String(node.operator || '')
    .toUpperCase()
    .includes('OR')
  if (!isOR) return null

  const children = node.criteria || []
  if (!children.length) return null

  let fieldKey: string | undefined
  const values: { label: string; matched?: boolean }[] = []

  for (const ch of children) {
    if (!isLeaf(ch)) return null
    const fk = canon(String(ch.fieldName || ''))
    if (!fk) return null
    if (!fieldKey) fieldKey = fk
    if (fieldKey !== fk) return null

    const label =
      ch.fieldValueLabel != null && String(ch.fieldValueLabel).trim() !== ''
        ? String(ch.fieldValueLabel)
        : ch.fieldValue != null
        ? String(ch.fieldValue)
        : ''

    const opLower = String(ch.operator || '').toLowerCase()
    if (!['', 'eq', 'in'].includes(opLower)) return null

    values.push({ label, matched: normalizeMatched(ch.isMatched) })
  }

  if (!fieldKey || values.length < 3) return null

  const fieldLabel = fieldToText(fieldKey, formMap)
  const grp = sectionForField(fieldKey, formMap)
  const parentText = `The patient must have a ${fieldLabel.toLowerCase()} of one of the following:`
  const kids: Item[] = values.map((v) => ({
    text: v.label,
    matched: v.matched,
    _group: grp,
  }))
  const parent: Item = {
    text: parentText,
    children: kids,
    logic: 'any',
    matched: liftMatchedFromChildren(kids),
    _group: grp,
  }
  return [parent]
}

/**
 * Converts a group/leaf node into renderable items (recurses).
 */
function nodeToItems(node: any, formMap?: FormMap): Item[] {
  if (isCriteriaGroup(node)) {
    const collapsed = tryCollapseSameFieldOR(node, formMap)
    if (collapsed) return collapsed
    const joiner: Logic = String(node.operator || '')
      .toUpperCase()
      .includes('OR')
      ? 'any'
      : 'all'
    const children = (node.criteria || []).flatMap((ch: any) =>
      nodeToItems(ch, formMap)
    )
    const parent: Item = {
      logic: joiner,
      children,
      matched: liftMatchedFromChildren(children),
    }
    return [parent]
  }

  if (isLeaf(node)) return [leafToItem(node, formMap)]
  if (Array.isArray(node)) return node.flatMap((n) => nodeToItems(n, formMap))
  return []
}

/**
 * Normalizes inclusion/exclusion into an array of nodes that represent logical groups.
 * Handles: single tree, array of trees, or an object keyed by numeric ids.
 */
function normalizeGroupNodes(objOrArr: any): Array<{ id?: string; node: any }> {
  if (!objOrArr) return []

  if (isCriteriaGroup(objOrArr)) return [{ id: undefined, node: objOrArr }]
  if (Array.isArray(objOrArr))
    return objOrArr.map((n) => ({ id: undefined, node: n }))
  if (typeof objOrArr === 'object') {
    const entries = Object.keys(objOrArr)
      .filter((k) => isCriteriaGroup(objOrArr[k]))
      .sort((a, b) => Number(a) - Number(b))
    if (entries.length > 0) {
      return entries.map((k) => ({ id: k, node: objOrArr[k] }))
    }

    if ('criteria' in objOrArr) return [{ id: undefined, node: objOrArr }]
  }
  return []
}

/**
 * Picks a title for a node: groupNames[id] if present - else most common form group among its leaves; else a fallback.
 */
function titleFromGroup(
  node: any,
  groupId: string | undefined,
  formMap?: FormMap,
  groupNames?: Record<string, string>
): string {
  if (groupId && groupNames && groupNames[groupId]) {
    return groupNames[groupId]
  }

  const tally = new Map<string, number>()
  const stack = [node]
  while (stack.length) {
    const cur: any = stack.pop()
    if (!cur || typeof cur !== 'object') continue
    if (Array.isArray(cur.criteria)) {
      for (let i = cur.criteria.length - 1; i >= 0; i--)
        stack.push(cur.criteria[i])
    } else if ('fieldName' in cur) {
      const fk = canon(String(cur.fieldName || ''))
      const sec = sectionForField(fk, formMap)
      tally.set(sec, (tally.get(sec) ?? 0) + 1)
    } else if (Array.isArray(cur)) {
      cur.forEach((v: any) => stack.push(v))
    }
  }

  if (tally.size > 0) {
    let best = 'Eligibility'
    let max = -1
    for (const [k, n] of tally)
      if (n > max) {
        best = k
        max = n
      }
    return titleCase(best)
  }

  return groupId ? `Eligibility Group ${groupId}` : 'Eligibility'
}

/**
 * Buckets items into sections by form group name.
 */
function bucketItemsByGroup(items: Item[]): Map<string, Item[]> {
  const buckets = new Map<string, Item[]>()

  function place(it: Item) {
    const grp = it._group
    if (grp) {
      if (!buckets.has(grp)) buckets.set(grp, [])
      buckets.get(grp)!.push(it)
      return
    }
    if (it.children && it.children.length) {
      it.children.forEach(place)
    }
  }

  items.forEach(place)
  return buckets
}

/* public API */

export function buildEligibilitySections(
  alg: any,
  opts: BuildOpts = {}
): Section[] {
  const { formMap, groupNames } = opts

  const inclusion = alg?.eligibility?.inclusion
  const exclusion = alg?.eligibility?.exclusion

  const inclusionGroups = normalizeGroupNodes(inclusion)
  const exclusionGroups = normalizeGroupNodes(exclusion)

  const sections: Section[] = []

  // Multiple inclusion groups - one section per node.
  if (
    inclusionGroups.length > 1 ||
    (inclusionGroups.length === 1 && inclusionGroups[0].id !== undefined)
  ) {
    for (const { id, node } of inclusionGroups) {
      const items = nodeToItems(node, formMap)
      const title = titleFromGroup(node, id, formMap, groupNames)
      sections.push({
        id: `${id ?? slugify(title)}-inclusion`,
        title,
        status: sectionStatus(items),
        items,
      })
    }
  } else if (inclusionGroups.length === 1) {
    // Single inclusion tree - split by form group in match_form order.
    const only = inclusionGroups[0].node
    const items = nodeToItems(only, formMap)
    const buckets = bucketItemsByGroup(items)

    // Use groupNames order if provided - else alphabetical by bucket name
    const orderedGroupNames = groupNames
      ? Object.keys(groupNames)
          .sort((a, b) => Number(a) - Number(b))
          .map((id) => groupNames[id])
      : Array.from(buckets.keys()).sort((a, b) => a.localeCompare(b))

    for (const gName of orderedGroupNames) {
      const groupItems = buckets.get(gName)
      if (!groupItems || groupItems.length === 0) continue
      sections.push({
        id: `${slugify(gName)}-inclusion`,
        title: gName,
        status: sectionStatus(groupItems),
        items: groupItems,
      })
    }
  }

  // Exclusion (mirrors inclusion handling).
  for (const { id, node } of exclusionGroups) {
    const items = nodeToItems(node, formMap)
    const base = titleFromGroup(node, id, formMap, groupNames)
    sections.push({
      id: `${id ?? slugify(base)}-exclusion`,
      title: `${base} (Exclusion)`,
      status: sectionStatus(items),
      items,
    })
  }

  // Fallback.
  if (sections.length === 0) {
    const items = nodeToItems(alg?.eligibility ?? alg, formMap)
    sections.push({
      id: 'eligibility',
      title: 'Eligibility Criteria',
      status: sectionStatus(items),
      items,
    })
  }

  return sections
}
