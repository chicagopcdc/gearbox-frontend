// builds outline sections from eligibility + form map
// colors items using user selections

type Logic = 'all' | 'any'

export type Item = {
  field?: string
  opText?: string
  valueText?: string
  text?: string
  matched?: boolean
  logic?: Logic
  children?: Item[]
  _group?: string
}

export type Section = {
  id: string
  title: string
  status: 'met' | 'not_met' | 'unknown'
  items: Item[]
}

// FormMap entries may be either a plain string or an object
// NOTE: `section` is what drives grouping in the outline.
type FormMapEntry = {
  label?: string
  shortLabel?: string
  options?: Record<string, string>
  section?: string
}
type FormMap = Record<string, string | FormMapEntry>

type BuildOpts = {
  formMap?: FormMap
  groupNames?: Record<string, string>
  // canon(field label) -> chosen value
  userSelectedByField?: Record<
    string,
    { kind: 'label' | 'number'; value: string | number }
  >
}

/* helpers */

const has = (o: unknown, k: PropertyKey): boolean =>
  Object.prototype.hasOwnProperty.call(o as object, k)

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
  return s.replace(/\b\w/g, (m) => m.toUpperCase())
}

function slugify(s: string): string {
  return (
    canon(s)
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section'
  )
}

function asEntry(
  v: string | FormMapEntry | undefined
): FormMapEntry | undefined {
  if (v == null) return undefined
  if (typeof v === 'string') return { section: v }
  return v
}

// map lookup (normalize by key or canonicalized string match)
function getEntry(
  fieldKey: string | undefined,
  formMap?: FormMap
): FormMapEntry | undefined {
  if (!fieldKey || !formMap) return undefined
  const key = canon(fieldKey)
  if (key in formMap) return asEntry((formMap as any)[key])
  for (const k of Object.keys(formMap)) {
    if (canon(k) === key) return asEntry((formMap as any)[k])
  }
  return undefined
}

// field label (prefers shortLabel/label)
function fieldToText(fieldKeyNorm: string, formMap?: FormMap): string {
  const e = getEntry(fieldKeyNorm, formMap)
  if (!e) return fieldKeyNorm
  if (!e.label && !e.shortLabel) return fieldKeyNorm
  return e.shortLabel || e.label || fieldKeyNorm
}

// option value -> display label using formMap.options (handles numeric 113 vs 113.0)
function valueToDisplay(
  fieldKeyNorm: string,
  raw: unknown,
  formMap?: FormMap
): string | undefined {
  if (raw == null || raw === '') return undefined
  const e = getEntry(fieldKeyNorm, formMap)
  const rawStr = String(raw)
  const mapped = e?.options?.[rawStr]
  return mapped ?? rawStr
}

// group name for a field (drives outline section headers)
function sectionForField(fieldKeyNorm: string, formMap?: FormMap): string {
  const e = getEntry(fieldKeyNorm, formMap)
  if (e?.section) return e.section
  return 'Eligibility'
}

// section status (red if any false; blue only if all true, at least one)
function sectionStatus(items: Item[]): 'met' | 'not_met' | 'unknown' {
  let sawTrue = false
  let sawFalse = false
  let sawUnknown = false
  const stack: Item[] = [...items]
  while (stack.length) {
    const it = stack.pop()!
    if (it.children?.length) {
      stack.push(...it.children)
      continue
    }
    if (it.matched === true) sawTrue = true
    else if (it.matched === false) sawFalse = true
    else sawUnknown = true
  }
  if (sawFalse) return 'not_met'
  if (sawTrue && !sawUnknown) return 'met'
  return 'unknown'
}

// operator words
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
      return 'is one of the following'
    default:
      return (op || '').trim()
  }
}

function opFromText(
  opText?: string
): 'eq' | 'in' | 'gte' | 'lte' | 'gt' | 'lt' | undefined {
  if (!opText) return undefined
  const t = opText.toLowerCase()
  if (t.includes('one of')) return 'in'
  if (t.includes('greater than or equal')) return 'gte'
  if (t.includes('less than or equal')) return 'lte'
  if (t.includes('greater than')) return 'gt'
  if (t.includes('less than')) return 'lt'
  if (t.includes('equal')) return 'eq'
  return undefined
}

function parseMaybeNumber(s: string | number | null | undefined) {
  if (s == null) return null
  const raw = typeof s === 'number' ? String(s) : s
  const trimmed = raw.trim()
  if (trimmed === '') return null
  const n = Number(trimmed.replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : null
}

// compare against current selection
function computeUserMatch(
  fieldLabel: string,
  opText: string | undefined,
  valueText: string | undefined,
  selectedByField?: BuildOpts['userSelectedByField']
): boolean | undefined {
  if (!selectedByField) return undefined
  const key = canon(fieldLabel)
  const chosen = selectedByField[key]
  if (!chosen) return undefined
  const op = opFromText(opText)
  if (!op) return undefined

  if (chosen.kind === 'label') {
    if (!valueText) return undefined
    return canon(String(chosen.value)) === canon(valueText)
  }
  if (chosen.kind === 'number') {
    const target = parseMaybeNumber(valueText)
    if (target == null) return undefined
    const val = Number(chosen.value)
    if (op === 'gte') return val >= target
    if (op === 'lte') return val <= target
    if (op === 'gt') return val > target
    if (op === 'lt') return val < target
    if (op === 'eq') return val === target
  }
  return undefined
}

/* shapes */

function isCriteriaGroup(node: any): boolean {
  return !!node && typeof node === 'object' && Array.isArray(node.criteria)
}
function isLeaf(node: any): boolean {
  return (
    !!node &&
    typeof node === 'object' &&
    ('fieldName' in node || 'field' in node)
  )
}

function normalizeMatched(v: any): boolean | undefined {
  return v === true ? true : v === false ? false : undefined
}

/* leaf + collapse */
function leafToItem(
  node: any,
  formMap?: FormMap,
  selectedByField?: BuildOpts['userSelectedByField']
): Item {
  const rawFieldName = (node.fieldName ?? node.field) as string
  const fieldKeyNorm = canon(String(rawFieldName || ''))
  const lhs = fieldToText(fieldKeyNorm, formMap)
  const op = opPhrase(node.operator)

  const raw = node.fieldValueLabel?.toString().trim()
    ? node.fieldValueLabel
    : node.valueLabel?.toString().trim()
    ? node.valueLabel
    : node.fieldValue ?? node.value

  const rhs = valueToDisplay(fieldKeyNorm, raw, formMap)

  const hasIM = Object.prototype.hasOwnProperty.call(node, 'isMatched')
  const hasM = Object.prototype.hasOwnProperty.call(node, 'matched')
  const matchedRaw = hasIM ? node.isMatched : hasM ? node.matched : undefined

  const userMatch = computeUserMatch(lhs, op, rhs, selectedByField)
  const matched = userMatch ?? normalizeMatched(matchedRaw)

  return {
    field: lhs,
    opText: op,
    valueText: rhs,
    matched,
    _group: sectionForField(fieldKeyNorm, formMap),
  }
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

// collapse OR where children are equals on same field (makes a parent with many values)
function tryCollapseSameFieldOR(
  node: any,
  formMap?: FormMap,
  selectedByField?: BuildOpts['userSelectedByField']
): Item[] | null {
  if (!isCriteriaGroup(node)) return null
  const isOR = String(node.operator || '')
    .toUpperCase()
    .includes('OR')
  if (!isOR) return null

  const children: any[] = node.criteria || []
  if (children.length < 3) return null

  const firstLeaf = children.find(isLeaf)
  if (!firstLeaf) return null

  const baseField = canon(
    String((firstLeaf.fieldName ?? firstLeaf.field) || '')
  )
  const sameField = children.every(
    (ch) =>
      isLeaf(ch) &&
      canon(String((ch.fieldName ?? ch.field) || '')) === baseField
  )
  if (!sameField) return null

  const values: Array<{ label: string; matched?: boolean }> = []
  for (const ch of children) {
    const opLower = String(ch.operator || '').toLowerCase()
    if (!['', 'eq', 'in'].includes(opLower)) return null

    const raw = ch.fieldValueLabel?.toString().trim()
      ? ch.fieldValueLabel
      : ch.valueLabel?.toString().trim()
      ? ch.valueLabel
      : ch.fieldValue ?? ch.value

    const display = valueToDisplay(baseField, raw, formMap) ?? String(raw ?? '')
    const userMatch = computeUserMatch(
      fieldToText(baseField, formMap),
      'is one of the following',
      display,
      selectedByField
    )
    const mRaw = Object.prototype.hasOwnProperty.call(ch, 'isMatched')
      ? ch.isMatched
      : Object.prototype.hasOwnProperty.call(ch, 'matched')
      ? ch.matched
      : undefined

    values.push({
      label: display,
      matched: userMatch ?? normalizeMatched(mRaw),
    })
  }

  const fieldLabel = fieldToText(baseField, formMap)
  const grp = sectionForField(baseField, formMap)

  const kids: Item[] = values.map((v) => ({
    valueText: v.label,
    matched: v.matched,
    _group: grp,
  }))

  const parent: Item = {
    field: fieldLabel,
    opText: 'is one of the following',
    logic: 'any',
    children: kids,
    _group: grp,
  }
  return [parent]
}

/* build items */

function nodeToItems(
  node: any,
  formMap?: FormMap,
  selectedByField?: BuildOpts['userSelectedByField']
): Item[] {
  if (isCriteriaGroup(node)) {
    const collapsed = tryCollapseSameFieldOR(node, formMap, selectedByField)
    if (collapsed) return collapsed
    const joiner: Logic = String(node.operator || '')
      .toUpperCase()
      .includes('OR')
      ? 'any'
      : 'all'
    const children = (node.criteria || []).flatMap((ch: any) =>
      nodeToItems(ch, formMap, selectedByField)
    )
    return [{ logic: joiner, children }]
  }

  if (isLeaf(node)) return [leafToItem(node, formMap, selectedByField)]
  if (Array.isArray(node))
    return node.flatMap((n) => nodeToItems(n, formMap, selectedByField))
  return []
}

/* grouping + titles */

function normalizeGroupNodes(objOrArr: any): Array<{ id?: string; node: any }> {
  if (!objOrArr) return []
  if (isCriteriaGroup(objOrArr)) return [{ id: undefined, node: objOrArr }]
  if (Array.isArray(objOrArr))
    return objOrArr.map((n) => ({ id: undefined, node: n }))
  if (typeof objOrArr === 'object') {
    const entries = Object.keys(objOrArr)
      .filter((k) => isCriteriaGroup(objOrArr[k]))
      .sort((a, b) => Number(a) - Number(b))
    if (entries.length > 0)
      return entries.map((k) => ({ id: k, node: objOrArr[k] }))
    if ('criteria' in objOrArr) return [{ id: undefined, node: objOrArr }]
  }
  return []
}

function titleFromGroup(
  node: any,
  groupId: string | undefined,
  formMap?: FormMap,
  groupNames?: Record<string, string>
): string {
  if (groupId && groupNames?.[groupId]) return groupNames[groupId]
  const tally = new Map<string, number>()
  const stack = [node]
  while (stack.length) {
    const cur: any = stack.pop()
    if (!cur || typeof cur !== 'object') continue
    if (Array.isArray(cur.criteria)) {
      for (let i = cur.criteria.length - 1; i >= 0; i--)
        stack.push(cur.criteria[i])
    } else if ('fieldName' in cur || 'field' in cur) {
      const fk = canon(String((cur.fieldName ?? cur.field) || ''))
      const sec = sectionForField(fk, formMap)
      tally.set(sec, (tally.get(sec) ?? 0) + 1)
    } else if (Array.isArray(cur)) {
      cur.forEach((v: any) => stack.push(v))
    }
  }
  if (tally.size > 0) {
    let best = 'Eligibility'
    let max = -1
    for (const [k, v] of tally)
      if (v > max) {
        best = k
        max = v
      }
    return titleCase(best)
  }
  return groupId ? `Eligibility Group ${groupId}` : 'Eligibility'
}

function bucketItemsByGroup(items: Item[]): Map<string, Item[]> {
  const buckets = new Map<string, Item[]>()
  function place(it: Item) {
    const grp = it._group
    if (grp) {
      if (!buckets.has(grp)) buckets.set(grp, [])
      buckets.get(grp)!.push(it)
      return
    }
    if (it.children?.length) it.children.forEach(place)
  }
  items.forEach(place)
  return buckets
}

/* public API */

export function buildEligibilitySections(
  alg: any,
  opts: BuildOpts = {}
): Section[] {
  const { formMap, groupNames, userSelectedByField } = opts

  const inclusion = alg?.eligibility?.inclusion
  const exclusion = alg?.eligibility?.exclusion

  const inclusionGroups = normalizeGroupNodes(inclusion)
  const exclusionGroups = normalizeGroupNodes(exclusion)

  const sections: Section[] = []

  // multiple inclusion groups => one section per node
  if (
    inclusionGroups.length > 1 ||
    (inclusionGroups.length === 1 && inclusionGroups[0].id !== undefined)
  ) {
    for (const { id, node } of inclusionGroups) {
      const items = nodeToItems(node, formMap, userSelectedByField)
      const title = titleFromGroup(node, id, formMap, groupNames)
      sections.push({
        id: `${id ?? slugify(title)}-inclusion`,
        title,
        status: sectionStatus(items),
        items,
      })
    }
  } else if (inclusionGroups.length === 1) {
    // single tree => split by form group order
    const only = inclusionGroups[0].node
    const items = nodeToItems(only, formMap, userSelectedByField)
    const buckets = bucketItemsByGroup(items)

    const ordered = groupNames
      ? Object.keys(groupNames)
          .sort((a, b) => Number(a) - Number(b))
          .map((id) => groupNames[id])
      : Array.from(buckets.keys()).sort((a, b) => a.localeCompare(b))

    for (const gName of ordered) {
      const groupItems = buckets.get(gName)
      if (!groupItems?.length) continue
      sections.push({
        id: `${slugify(gName)}-inclusion`,
        title: gName,
        status: sectionStatus(groupItems),
        items: groupItems,
      })
    }
  }

  // exclusion groups appended
  for (const { id, node } of exclusionGroups) {
    const items = nodeToItems(node, formMap, userSelectedByField)
    const base = titleFromGroup(node, id, formMap, groupNames)
    sections.push({
      id: `${id ?? slugify(base)}-exclusion`,
      title: `${base} (Exclusion)`,
      status: sectionStatus(items),
      items,
    })
  }

  // fallback
  if (sections.length === 0) {
    const items = nodeToItems(
      alg?.eligibility ?? alg,
      formMap,
      userSelectedByField
    )
    sections.push({
      id: 'eligibility',
      title: 'Eligibility Criteria',
      status: sectionStatus(items),
      items,
    })
  }

  return sections
}
