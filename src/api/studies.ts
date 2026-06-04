import type { Study } from '../model'
import { fetchGearbox } from './utils'

function sortStudySites(studies: Study[]): Study[] {
  return studies.map((s) => ({
    ...s,
    sites: [...s.sites].sort((a, b) => {
      const nameA = a.name?.toLowerCase() ?? ''
      const nameB = b.name?.toLowerCase() ?? ''
      if (nameA < nameB) return -1
      if (nameA > nameB) return 1
      return 0
    }),
  }))
}

export function getStudies(): Promise<Study[]> {
  return fetchGearbox('/gearbox-middleware/studies')
    .then((res) => {
      if (!res.ok) {
        throw new Error(`failed to get studies URL: ${res.status}`)
      }

      return res.json() as Promise<string>
    })
    .then((url) => fetch(url))
    .then((res) => {
      if (!res.ok) {
        throw new Error(`failed to fetch studies JSON: ${res.status}`)
      }

      return res.json() as Promise<{ version: string; studies: Study[] }>
    })
    .then((res) => sortStudySites(res.studies))
}

export async function buildStudies(): Promise<void> {
  const res = await fetchGearbox('/gearbox/build-studies', {
    method: 'POST',
  })

  if (!res.ok) {
    throw new Error(`build studies failed: ${res.status}`)
  }
}
