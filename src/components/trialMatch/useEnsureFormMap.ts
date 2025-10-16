import { useEffect, useMemo, useState } from 'react'

export type FieldToSectionMap = Record<string, string>

type MatchForm = {
  groups: Array<{ id: number; name: string }>
  fields: Array<{
    id: number
    groupId: number
    name: string
    label: string
    type: string
    options?: Array<{
      value: number | string
      label: string
      description?: string
    }>
    min?: number
    max?: number
    step?: number
    placeholder?: string
  }>
}

type UseFormMapResult = {
  map: FieldToSectionMap
  groupNames: Record<string, string>
  loading: boolean
  error: string | null
}

function canon(s: string | undefined | null): string {
  return String(s ?? '')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Loads match_form JSON (or a URL that points to it) and returns:
 * - map: normalized label → group title
 * - groupNames: id → group title (preserves match_form order externally)
 */
async function fetchMatchFormFlexible(url: string): Promise<MatchForm> {
  const res1 = await fetch(url, { method: 'GET' })
  if (!res1.ok) throw new Error(`Failed to load ${url}: ${res1.status}`)

  const ct1 = (res1.headers.get('Content-Type') || '').toLowerCase()

  // If JSON, try json() first
  if (ct1.includes('application/json')) {
    const parsed = await res1.json() // may be object OR a string
    if (
      parsed &&
      typeof parsed === 'object' &&
      'groups' in parsed &&
      'fields' in parsed
    ) {
      return parsed as MatchForm
    }
    if (typeof parsed === 'string') {
      // Body is a JSON string containing the real URL
      const res2 = await fetch(parsed, { method: 'GET' })
      if (!res2.ok) throw new Error(`Failed to follow URL: ${res2.status}`)
      const parsed2 = await res2.json()
      return parsed2 as MatchForm
    }
    throw new Error('Unexpected JSON payload from match-form endpoint')
  }

  // Not JSON content-type
  const maybeUrl = (await res1.text()).trim()
  try {
    // If it parses as a URL, follow it
    const u = new URL(maybeUrl)
    const res2 = await fetch(u.toString(), { method: 'GET' })
    if (!res2.ok)
      throw new Error(`Failed to fetch redirected JSON: ${res2.status}`)
    const ct2 = (res2.headers.get('Content-Type') || '').toLowerCase()
    if (!ct2.includes('application/json')) {
      // Not JSON? Try json()
      const text2 = await res2.text()
      try {
        return JSON.parse(text2) as MatchForm
      } catch {
        throw new Error('Redirected body is not JSON')
      }
    }
    const data2 = await res2.json()
    return data2 as MatchForm
  } catch {
    // Not a URL
    try {
      return JSON.parse(maybeUrl) as MatchForm
    } catch {
      throw new Error('match-form endpoint returned non-JSON, non-URL text')
    }
  }
}

export function useEnsureFormMap(formPath: string): UseFormMapResult {
  const [matchForm, setMatchForm] = useState<MatchForm | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchMatchFormFlexible(formPath)
        if (!cancelled) setMatchForm(data)
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Failed to load match form')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [formPath])

  const { map, groupNames } = useMemo(() => {
    const outMap: FieldToSectionMap = {}
    const names: Record<string, string> = {}
    if (!matchForm) return { map: outMap, groupNames: names }

    for (const g of matchForm.groups ?? []) {
      names[String(g.id)] = g.name
    }
    for (const f of matchForm.fields ?? []) {
      const gName = names[String(f.groupId)] ?? 'Eligibility'
      const key = canon(f.label)
      if (key) outMap[key] = gName
    }
    return { map: outMap, groupNames: names }
  }, [matchForm])

  return { map, groupNames, loading, error }
}
