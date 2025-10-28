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

function isMatchForm(v: unknown): v is MatchForm {
  return !!v && typeof v === 'object' && 'groups' in v && 'fields' in v
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { method: 'GET' })
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`)
  const ct = (res.headers.get('Content-Type') || '').toLowerCase()
  if (!ct.includes('application/json')) {
    // eslint-disable-next-line prettier/prettier
    // prettier-ignore
    throw new Error(
      `Expected JSON from ${url}, got ${ct || 'unknown content-type'}`
    )
  }
  return (await res.json()) as T
}

export async function fetchMatchFormFlexible(url: string): Promise<MatchForm> {
  const parsed = await fetchJson<unknown>(url)

  // JSON string means “follow this URL”
  if (typeof parsed === 'string') {
    const next = await fetchJson<unknown>(parsed)
    if (isMatchForm(next)) return next
    throw new Error('Followed URL did not return a MatchForm JSON')
  }

  if (isMatchForm(parsed)) return parsed
  throw new Error('Unexpected JSON payload from match-form endpoint')
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
