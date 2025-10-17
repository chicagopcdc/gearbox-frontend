// builds outline sections from eligibility + form map
// colors items using local user selections

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
  userSelectedByField?: Record<
    string,
    { kind: 'label' | 'number'; value: string | number }
  >
}

// normalize
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
  for (const k of Object.keys(formMap))
    if (canon(k) === key) return (formMap as any)[k]
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

// status helper: we want red if any false; blue only if ALL true (at least one); else gray
function sectionStatus(items: Item[]): 'met' | 'not_met' | 'unknown' {
  let sawTrue = false
  let sawFalse = false
  let sawUnknown = false
  const stack: Item[] = [...items]
  while (stack.length) {
    const it = stack.pop()!
    if (it.children && it.children.length) {
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

// words, operator
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

// operator string in text, token
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

function isCriteriaGroup(node: any): boolean {
  return !!node && typeof node === 'object' && Array.isArray(node.criteria)
}
function isLeaf(node: any): boolean {
  return !!node && typeof node === 'object' && 'fieldName' in node
}

// compare a leaf with user's chosen value
function computeUserMatch(
  fieldLabel: string,
  opText: string | undefined,
  valueText: string | undefined,
  selectedByField?: Record<
    string,
    { kind: 'label' | 'number'; value: string | number }
  >
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
    const n = Number(chosen.value)
    const leafN = Number((valueText ?? '').toString().replace(/[^\d.+-]/g, ''))
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

function leafToItem(
  node: any,
  formMap?: FormMap,
  selectedByField?: BuildOpts['userSelectedByField']
): Item {
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

  const hasIM = Object.prototype.hasOwnProperty.call(node, 'isMatched')
  const hasM = Object.prototype.hasOwnProperty.call(node, 'matched')
  const matchedRaw = hasIM ? node.isMatched : hasM ? node.matched : undefined

  // prefer user match; fallback to payload flag
  const userMatch = computeUserMatch(lhs, op, rhs || undefined, selectedByField)
  const matched = userMatch ?? normalizeMatched(matchedRaw)

  return {
    field: lhs,
    opText: op,
    valueText: rhs !== '' ? String(rhs) : undefined,
    text: rhs !== '' ? `${lhs} ${op} ${rhs}` : `${lhs} ${op}`,
    matched,
    _group: grp,
  }
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

    const e = getEntry(fieldKey, formMap)
    const display =
      e && typeof e === 'object' && e.options
        ? e.options[String(label)] ?? label
        : label
    const userMatch = computeUserMatch(
      fieldToText(fieldKey, formMap),
      'is one of',
      display,
      selectedByField
    )

    const mHasIM = Object.prototype.hasOwnProperty.call(ch, 'isMatched')
    const mHasM = Object.prototype.hasOwnProperty.call(ch, 'matched')
    const mRaw = mHasIM ? ch.isMatched : mHasM ? ch.matched : undefined

    values.push({
      label: display,
      matched: userMatch ?? normalizeMatched(mRaw),
    })
  }

  if (!fieldKey || values.length < 3) return null

  const fieldLabel = fieldToText(fieldKey, formMap)
  const grp = sectionForField(fieldKey, formMap)

  const kids: Item[] = values.map((v) => ({
    valueText: v.label,
    text: v.label,
    matched: v.matched,
    _group: grp,
  }))

  const parent: Item = {
    field: fieldLabel,
    opText: 'is one of the following:',
    text: `The patient must have a ${fieldLabel.toLowerCase()} of one of the following:`,
    children: kids,
    logic: 'any',
    matched: liftMatchedFromChildren(kids),
    _group: grp,
  }
  return [parent]
}

// bubble child matched flags up one level (used for OR collapses)
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

// recurse the eligibility tree into items
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
    const parent: Item = {
      logic: joiner,
      children,
      matched: liftMatchedFromChildren(children),
    }
    return [parent]
  }

  if (isLeaf(node)) return [leafToItem(node, formMap, selectedByField)]
  if (Array.isArray(node))
    return node.flatMap((n) => nodeToItems(n, formMap, selectedByField))
  return []
}

// accept single tree / array / map of trees
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

// choose title using groupNames[id] when present; else the common form group
function titleFromGroup(
  node: any,
  groupId: string | undefined,
  formMap?: FormMap,
  groupNames?: Record<string, string>
): string {
  if (groupId && groupNames && groupNames[groupId]) return groupNames[groupId]
  const tally = new Map<string, number>()
  const stack = [node]
  while (stack.length) {
    const cur: any = stack.pop()
    if (!cur || typeof cur !== 'object') continue
    if (Array.isArray(cur.criteria))
      for (let i = cur.criteria.length - 1; i >= 0; i--)
        stack.push(cur.criteria[i])
    else if ('fieldName' in cur) {
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

// put items into sections (by form group)
function bucketItemsByGroup(items: Item[]): Map<string, Item[]> {
  const buckets = new Map<string, Item[]>()
  function place(it: Item) {
    const grp = it._group
    if (grp) {
      if (!buckets.has(grp)) buckets.set(grp, [])
      buckets.get(grp)!.push(it)
      return
    }
    if (it.children && it.children.length) it.children.forEach(place)
  }
  items.forEach(place)
  return buckets
}

// main builder
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

  // many inclusion groups, one section per node
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
    // single tree, split by form group order
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
