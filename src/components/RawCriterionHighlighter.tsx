import { useMemo } from 'react'
import { HighlightSpan, RawCriterion } from '../model'
import { clamp, escapeHtml, getOrCreate } from '../utils'

function collectSpans(rc: RawCriterion | null): HighlightSpan[] {
  const result: HighlightSpan[] = []
  rc?.pre_annotated?.forEach((p) => {
    const [s, e, label] = p.span
    if (Number.isFinite(s) && Number.isFinite(e) && e > s) {
      result.push({
        start: s,
        end: e,
        label,
        source: 'pre',
      })
    }
  })

  rc?.entities?.forEach((ent) => {
    const { start_offset: s, end_offset: e, label } = ent
    if (Number.isFinite(s) && Number.isFinite(e) && e > s) {
      result.push({ start: s, end: e, label, source: 'entity' })
    }
  })

  return result
}

// Uniform color classes (no translucency). Vary ring by source; overlap gets its own.
const openCls = (hasE: boolean, hasP: boolean) => {
  const base = 'rounded px-0.5 ring-2'
  if (hasE && hasP) {
    // overlap = amber
    return `${base} bg-amber-100 text-amber-900 ring-amber-600`
  }
  if (hasE) {
    // entity = indigo
    return `${base} bg-indigo-100 text-indigo-900 ring-indigo-600`
  }
  // pre = teal
  return `${base} bg-teal-100 text-teal-900 ring-teal-600`
}

function buildHighlightedHtml(text: string, spans: HighlightSpan[]): string {
  if (!text || !spans.length) {
    return text
  }
  const len = text.length
  const starts = new Map<number, HighlightSpan[]>()
  const ends = new Map<number, HighlightSpan[]>()
  const pts = new Set<number>([0, len])

  for (const s of spans) {
    const a = clamp(s.start, len)
    const b = clamp(s.end, len)
    if (b <= a) continue
    getOrCreate(starts, a).push(s)
    getOrCreate(ends, b).push(s)
    pts.add(a)
    pts.add(b)
  }

  const sorted = Array.from(pts).sort((a, b) => a - b)
  const active: HighlightSpan[] = []
  let out = ''

  for (let i = 0; i < sorted.length - 1; i++) {
    const pos = sorted[i]
    // close, then open (treat end as exclusive)
    for (const s of ends.get(pos) ?? []) {
      const k = active.indexOf(s)
      if (k >= 0) active.splice(k, 1)
    }
    for (const s of starts.get(pos) ?? []) active.push(s)

    const next = sorted[i + 1]
    if (next <= pos) continue

    const raw = text.slice(pos, next)
    const segment = escapeHtml(raw)

    if (active.length === 0) {
      out += segment
      continue
    }

    const hasEntity = active.some((a) => a.source === 'entity')
    const hasPre = active.some((a) => a.source === 'pre')
    const cls = openCls(hasEntity, hasPre)

    const labels = Array.from(
      new Set(active.map((a) => a.label).filter(Boolean))
    ) as string[]
    const title = labels.length
      ? ` title="${escapeHtml(labels.join(', '))}"`
      : ''

    out += `<mark class="${cls}" data-source="${
      hasEntity && hasPre ? 'both' : hasEntity ? 'entity' : 'pre'
    }"${title}>${segment}</mark>`
  }

  return out
}

export function RawCriterionHighlighter({
  rawCriterion,
}: {
  rawCriterion: RawCriterion | null
}) {
  const text = rawCriterion?.text ?? ''

  const spans = useMemo(() => collectSpans(rawCriterion), [rawCriterion])
  const html = useMemo(() => buildHighlightedHtml(text, spans), [spans, text])

  return (
    <div className="w-full p-4">
      <div className="flex items-center gap-3 text-xs mb-3">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded ring-2 ring-indigo-600 bg-indigo-100" />
          entity
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded ring-2 ring-teal-600 bg-teal-100" />
          pre
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded ring-2 ring-amber-600 bg-amber-100" />
          overlap
        </span>
      </div>
      <pre
        className="whitespace-pre-wrap break-words bg-slate-50 text-slate-900 rounded p-4 leading-6 text-sm"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
