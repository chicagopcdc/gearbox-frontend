// ---------------------------------------------
// Types used by the UI
// ---------------------------------------------
export type SectionStatus = 'met' | 'not-met' | 'unknown'

// Each bullet in a section is either:
// - a leaf item:    { text, matched? }
// - a group parent: { text?, logic: 'all'|'any', children: SectionItem[] }
export type SectionItem = {
  text?: string
  matched?: boolean
  children?: SectionItem[]
  logic?: 'all' | 'any'
}

// A rendered section panel in the UI
export type Section = {
  id: string
  title: string
  status: SectionStatus
  items: SectionItem[]
}

// Fixed order the UI should display (and default statuses when empty)
const BASE_SECTIONS: Array<{
  id: Section['id']
  title: string
  defaultStatus: SectionStatus
}> = [
  { id: 'additional', title: 'Additional Criteria', defaultStatus: 'unknown' },
  { id: 'demographics', title: 'Demographics', defaultStatus: 'met' },
  { id: 'disease', title: 'Disease', defaultStatus: 'met' },
  { id: 'treatment', title: 'Treatment and Exposure', defaultStatus: 'met' },
  { id: 'organ', title: 'Organ Function', defaultStatus: 'not-met' },
  { id: 'biomarkers', title: 'Biomarkers', defaultStatus: 'not-met' },
]

// ---------------------------------------------
// Entry point: take the raw eligibility payload (a tree of groups/leaves,
// often under numeric keys at the top level) and produce the 6 UI sections.
// The result preserves logical nesting (AND/OR) within a section and
// flattens mixed-section groups so items appear under their proper panels.
// ---------------------------------------------
export function buildEligibilitySections(root: any): Section[] {
  // Create the 6 sections and bookkeeping for de-dup + status aggregation
  const sections: Record<string, Section> = {}
  const defaults: Record<string, SectionStatus> = {}
  const seen: Record<string, Set<string>> = {} // per-section “already added” cache
  const perSectionMatches: Record<string, boolean[]> = {} // raw matched flags to compute status

  for (const s of BASE_SECTIONS) {
    sections[s.id] = {
      id: s.id,
      title: s.title,
      status: s.defaultStatus,
      items: [],
    }
    defaults[s.id] = s.defaultStatus
    seen[s.id] = new Set()
    perSectionMatches[s.id] = []
  }

  // Helper: push an item into a section, avoiding duplicates, and collect match flags
  const add = (sectionId: string, item: SectionItem) => {
    const sec = sections[sectionId] || sections['additional']
    const key = serializeItem(item) // stable key to avoid dup bullets
    if (!key) return
    if (!seen[sec.id].has(key)) {
      seen[sec.id].add(key)
      sec.items.push(item)
      collectMatchFlags(item, perSectionMatches[sec.id])
    }
  }

  // The payload root is usually an object with numbered keys ("1","2",...)
  if (root && typeof root === 'object' && !Array.isArray(root)) {
    Object.values(root).forEach((node: any) => addGroupOrLeaf(node))
  } else {
    addGroupOrLeaf(root)
  }

  // Compute each section’s status from child matched flags
  for (const id of Object.keys(sections)) {
    const flags = perSectionMatches[id]
    if (!flags.length) {
      sections[id].status = defaults[id]
      continue
    }
    if (flags.some((m) => m === false)) {
      sections[id].status = 'not-met'
      continue
    }
    if (flags.every((m) => m === true)) {
      sections[id].status = 'met'
      continue
    }
    sections[id].status = 'unknown'
  }

  // Return in the fixed order the UI expects
  return BASE_SECTIONS.map((s) => sections[s.id])

  // -------------------------------------------
  // Walker: handles either groups or leaf rules
  // -------------------------------------------
  function addGroupOrLeaf(node: any) {
    if (!node) return

    // GROUP node shape:
    // { operator: 'AND' | 'OR', criteria: [ <group|leaf> , ... ] }
    // If all children resolve to the SAME section, we return ONE parent item
    // with nested children (logic: 'all' for AND, 'any' for OR).
    // If children span MULTIPLE sections, we FLATTEN and return an array of
    // [sectionId, item] tuples so each child lands in its correct section.
    if (Array.isArray(node.criteria)) {
      const grouped = buildGroupedItem(node) // ← returns Array<[sectionId, item]> | null
      if (!grouped) return
      for (const [sectionId, item] of grouped) add(sectionId, item) // ← iterate tuples directly
      return
    }

    // LEAF: { fieldName, fieldValueLabel, fieldValue, operator, isMatched }
    if (node.fieldName) {
      const sectionId = pickSection(String(node.fieldName)) // route to one of the 6 sections
      const text = humanize(
        String(node.fieldName),
        node.operator,
        node.fieldValue,
        node.fieldValueLabel
      ) // make a readable bullet
      add(sectionId, { text, matched: asBool(node.isMatched) })
      return
    }

    // Unknown shape: walk nested values defensively
    if (typeof node === 'object') Object.values(node).forEach(addGroupOrLeaf)
  }

  // -------------------------------------------
  // Build a nested item when a group’s children
  // all map to the same section; otherwise flatten.
  //
  // IMPORTANT: This returns an ARRAY OF TUPLES:
  //   Array<[ sectionId: string, item: SectionItem ]>
  // (We used Map before; arrays are simpler to consume and avoid key mistakes.)
  // -------------------------------------------
  function buildGroupedItem(
    groupNode: any
  ): Array<[string, SectionItem]> | null {
    // Normalize operator to 'all' (AND) or 'any' (OR)
    const op: 'all' | 'any' = String(groupNode.operator || '')
      .toUpperCase()
      .includes('OR')
      ? 'any'
      : 'all'

    // Gather children with their eventual sections
    const childResults: Array<{ sectionId: string; item: SectionItem }> = []
    for (const child of groupNode.criteria as any[]) {
      if (!child) continue

      if (Array.isArray(child.criteria)) {
        // Nested group → recurse
        const nested = buildGroupedItem(child)
        if (nested) {
          // NOTE: `nested` is an array of [secId, item] tuples — iterate directly
          for (const [secId, nestedItem] of nested) {
            childResults.push({ sectionId: secId, item: nestedItem })
          }
        }
      } else if (child.fieldName) {
        const sectionId = pickSection(String(child.fieldName))
        const text = humanize(
          String(child.fieldName),
          child.operator,
          child.fieldValue,
          child.fieldValueLabel
        )
        childResults.push({
          sectionId,
          item: { text, matched: asBool(child.isMatched) },
        })
      } else if (typeof child === 'object') {
        // Defensive: some payloads wrap leaves under extra keys
        Object.values(child).forEach((leaf: any) => {
          if (leaf?.fieldName) {
            const sectionId = pickSection(String(leaf.fieldName))
            const text = humanize(
              String(leaf.fieldName),
              leaf.operator,
              leaf.fieldValue,
              leaf.fieldValueLabel
            )
            childResults.push({
              sectionId,
              item: { text, matched: asBool(leaf.isMatched) },
            })
          }
        })
      }
    }

    if (childResults.length === 0) return null

    // If all children belong to ONE section → emit a nested parent item for that section
    const singleSection = childResults.every(
      (cr) => cr.sectionId === childResults[0].sectionId
    )
    if (singleSection) {
      const sectionId = childResults[0].sectionId
      const parentLabel =
        op === 'all' ? 'All of the following:' : 'Any of the following:'
      const children = dedupeItems(childResults.map((cr) => cr.item))
      const parent: SectionItem = {
        text: parentLabel, // change to '' if you want no label on parents
        logic: op, // helps the UI show (AND)/(OR)
        children,
        matched: aggregateMatched(
          children.map((c) => c.matched),
          op
        ),
      }
      return [[sectionId, parent]]
    }

    // Mixed sections → flatten: return individual items for their own sections
    const bySection = new Map<string, SectionItem[]>()
    for (const cr of childResults) {
      const arr = bySection.get(cr.sectionId) || []
      arr.push(cr.item)
      bySection.set(cr.sectionId, arr)
    }

    const out: Array<[string, SectionItem]> = []
    for (const [sec, items] of bySection.entries()) {
      // We push items one-by-one; serializeItem prevents duplicates in `add`
      for (const it of dedupeItems(items)) out.push([sec, it]) // keep the REAL section id here
    }
    return out
  }
}

// ---------------------------------------------
// Helper utilities (dedupe, status, coercions)
// ---------------------------------------------

// Create a stable string representation so we can skip duplicates
function serializeItem(it: SectionItem): string | null {
  if (it.children && it.children.length) {
    const kids = it.children.map(serializeItem).filter(Boolean).join('||')
    return `${it.logic || ''}|${it.text || ''}|${kids}`
  }
  return it.text ? it.text : null
}

// De-dupe an array of items by their serialized form (text + child tree)
function dedupeItems(items: SectionItem[]): SectionItem[] {
  const seen = new Set<string>()
  const out: SectionItem[] = []
  for (const it of items) {
    const key = serializeItem(it) || ''
    if (!seen.has(key)) {
      seen.add(key)
      out.push(it)
    }
  }
  return out
}

// Collect matched flags from a (possibly nested) item; used for section status
function collectMatchFlags(item: SectionItem, bucket: boolean[]) {
  if (typeof item.matched === 'boolean') bucket.push(item.matched)
  if (item.children)
    item.children.forEach((ch) => collectMatchFlags(ch, bucket))
}

// Combine child match flags to infer the parent’s match state (optional)
function aggregateMatched(
  flags: Array<boolean | undefined>,
  op: 'all' | 'any'
): boolean | undefined {
  const vals = flags.filter((f): f is boolean => typeof f === 'boolean')
  if (!vals.length) return undefined
  return op === 'all' ? vals.every(Boolean) : vals.some(Boolean)
}

function asBool(v: unknown): boolean | undefined {
  return typeof v === 'boolean' ? v : undefined
}

// ---------------------------------------------
// Router: map a fieldName to one of the 6 sections
// (Simple keyword routing; easy to extend as new fields appear.)
// ---------------------------------------------
function pickSection(fieldName: string): Section['id'] {
  const t = fieldName.toLowerCase()

  // Demographics
  if (
    t.includes('current age') ||
    t.includes('biological sex') ||
    t.includes('cns status')
  )
    return 'demographics'

  // Disease
  if (
    t.includes('current diagnosis') ||
    t.includes('ecog') ||
    t.includes('bclc stage')
  )
    return 'disease'
  if (
    t.includes('child-pugh') ||
    t.includes('child pugh') ||
    t.includes('relapse') ||
    t.includes('refractory')
  )
    return 'disease'
  if (
    t.includes('curative therapy') ||
    t.includes('hiv') ||
    t.includes('hepatitis') ||
    t.includes('infection')
  )
    return 'disease'

  // Treatment & Exposure
  if (
    t.includes('hematopoietic cell transplantation') ||
    t.includes('transplant')
  )
    return 'treatment'
  if (
    t.includes('prior exposure') ||
    t.includes('venetoclax') ||
    t.includes('anthracycline')
  )
    return 'treatment'
  if (
    t.includes('radiotherapy') ||
    t.includes('rt') ||
    t.includes('cyp3a') ||
    t.includes('cytokines') ||
    t.includes('growth factor')
  )
    return 'treatment'
  if (
    t.includes('antibody-drug conjugate') ||
    t.includes('cytotoxic chemotherapy')
  )
    return 'treatment'

  // Organ function (labs & panels)
  if (
    t.includes('liver function') ||
    t.includes('renal function') ||
    t.includes('cardiac function')
  )
    return 'organ'
  if (
    t.includes('left ventricular function') ||
    t.includes('ejection fraction') ||
    t.includes('shortening fraction')
  )
    return 'organ'
  if (
    t.includes('bilirubin') ||
    t.includes('sgot') ||
    t.includes('ast') ||
    t.includes('sgpt') ||
    t.includes('alt')
  )
    return 'organ'
  if (t.includes('serum creatinine') || t.includes('creatinine clearance'))
    return 'organ'
  if (
    t.includes('hemoglobin') ||
    t.includes('platelet') ||
    t.includes('absolute neutrophil count') ||
    /\banc\b/.test(t)
  )
    return 'organ'
  if (t.includes('international normalized ratio') || /\binr\b/.test(t))
    return 'organ'

  // Biomarkers
  if (
    t.includes('kmt2a') ||
    t.includes('kmt2ar') ||
    t.includes('gpc3') ||
    t.includes('glypican')
  )
    return 'biomarkers'

  // Fallback bucket (for anything not matched above)
  return 'additional'
}

// ---------------------------------------------
// Humanizer: convert a raw field/operator/value into a friendly bullet
// ---------------------------------------------
function humanize(
  fieldName: string,
  op?: string,
  value?: unknown,
  label?: string | null
): string {
  const t = fieldName.toLowerCase()
  const v = (label ?? (value != null ? String(value) : '')).trim()
  const normOp =
    op === 'gte'
      ? '≥'
      : op === 'lte'
      ? '≤'
      : op === 'gt'
      ? '>'
      : op === 'lt'
      ? '<'
      : op === 'eq'
      ? '='
      : op || ''

  // Demographics
  if (t.includes('current age'))
    return v ? `Age ${normOp} ${v} years.` : 'Age requirement applies.'
  if (t.includes('biological sex')) return `Biological sex: ${v || '—'}.`
  if (t.includes('cns status')) return `CNS status: ${v || '—'}.`

  // Disease
  if (t.includes('current diagnosis'))
    return v
      ? `Diagnosis must include: ${v}.`
      : 'Diagnosis requirement applies.'
  if (t.includes('ecog'))
    return v
      ? `ECOG performance status: ${v}.`
      : 'ECOG performance status requirement applies.'
  if (t.includes('bclc stage'))
    return v ? `BCLC stage: ${v}.` : 'BCLC stage requirement applies.'
  if (t.includes('child-pugh') || t.includes('child pugh'))
    return v
      ? `Child–Pugh–Turcotte ${normOp} ${v}.`
      : 'Child–Pugh–Turcotte requirement applies.'
  if (t.includes('curative therapy'))
    return `No known curative therapy: ${v || '—'}.`
  if (t.includes('refractory'))
    return v
      ? `Refractory disease: ${v}.`
      : 'Refractory disease requirement applies.'
  if (t.includes('relapse'))
    return v ? `Relapse: ${v}.` : 'Relapse requirement applies.'
  if (t.includes('hiv')) return `HIV infection: ${v || '—'}.`
  if (t.includes('hepatitis b') || t.includes('hepatitis c'))
    return `Hepatitis B/C infection: ${v || '—'}.`
  if (t.includes('infection'))
    return `Active, uncontrolled infection: ${v || '—'}.`

  // Treatment & Exposure
  if (t.includes('hematopoietic cell transplantation'))
    return `Prior HCT exposure: ${v || '—'}.`
  if (t.includes('transplant'))
    return `Transplant: ${v || `${normOp} ${String(value ?? '')}`}`.trim() + '.'
  if (t.includes('venetoclax')) return `Prior venetoclax exposure: ${v || '—'}.`
  if (t.includes('cyp3a'))
    return `Exposure to strong CYP3A/3A4 inhibitors: ${v || '—'}.`
  if (t.includes('radiotherapy')) return `Radiotherapy: ${v || '—'}.`
  if (t.includes('cytotoxic chemotherapy'))
    return `Cytotoxic chemotherapy: ${v || '—'}.`
  if (t.includes('antibody-drug conjugate'))
    return `Antibody–drug conjugate: ${v || '—'}.`
  if (t.includes('interleukins') || t.includes('cytokines'))
    return `Interleukins/Interferons/Cytokines: ${v || '—'}.`
  if (t.includes('growth factor')) return `Growth factor exposure: ${v || '—'}.`
  if (t.includes('how many days have elapsed'))
    return `Elapsed days since last exposure: ${normOp} ${v}.`
  if (t.includes('how much cumulative anthracycline'))
    return `Cumulative anthracycline dose ${normOp} ${v} mg/m².`

  // Organ function & labs
  if (t.includes('cardiac function test results'))
    return `Cardiac function: ${v || '—'}.`
  if (t.includes('left ventricular function'))
    return `Left ventricular function: ${v || '—'}.`
  if (t.includes('ejection fraction'))
    return `Ejection Fraction (EF) ${normOp} ${v}%.`
  if (t.includes('shortening fraction'))
    return `Shortening Fraction (SF) ${normOp} ${v}%.`
  if (t.includes('renal function test results'))
    return `Renal function: ${v || '—'}.`
  if (t.includes('calculated creatinine clearance'))
    return `Calculated creatinine clearance ${normOp} ${v} mL/min/1.73m².`
  if (t.includes('serum creatinine'))
    return `Serum creatinine ${normOp} ${v} mg/dL.`
  if (t.includes('liver function test results'))
    return `Liver function: ${v || '—'}.`
  if (t.includes('direct bilirubin'))
    return `Direct bilirubin ${normOp} ${v} ×ULN.`
  if (t.includes('bilirubin (sum of conjugated'))
    return `Bilirubin (sum of conjugated + unconjugated) ${normOp} ${v} ×ULN (age).`
  if (t.includes('sgot (ast)')) return `SGOT (AST) ${normOp} ${v} ×ULN.`
  if (t.includes('sgpt (alt)')) return `SGPT (ALT) ${normOp} ${v} ×ULN.`
  if (t.includes('hemoglobin')) return `Hemoglobin ${normOp} ${v} g/dL.`
  if (t.includes('platelet count'))
    return `Platelet count ${normOp} ${v} ×10^3/µL.`
  if (t.includes('absolute neutrophil count') || /\banc\b/.test(t))
    return `Absolute neutrophil count (ANC) ${normOp} ${v} ×10^3/µL.`
  if (t.includes('international normalized ratio') || /\binr\b/.test(t))
    return `International Normalized Ratio (INR) ${normOp} ${v}.`

  // Biomarkers
  if (t.includes('kmt2a') || t.includes('kmt2ar'))
    return `KMT2A rearrangement: ${v || '—'}.`
  if (t.includes('gpc3') || t.includes('glypican'))
    return `GPC3 expression: ${v || '—'}.`

  // Fallback (unmapped field): show something readable so nothing is lost
  const base = [fieldName, normOp, v].filter(Boolean).join(' ').trim()
  return base ? `${base}.` : ''
}
