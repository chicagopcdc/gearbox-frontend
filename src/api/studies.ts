import type { Study } from '../model'
import { fetchGearbox, readCache, writeCache } from './utils'

const SESSION_STORAGE_KEY = 'gearbox:studies'

export function getStudies() {
  const cache = readCache<Study[]>(SESSION_STORAGE_KEY)
  if (cache !== null) return Promise.resolve(cache)

  return fetchGearbox('/gearbox/studies')
    .then((res) => res.json() as Promise<{ version: string; studies: Study[] }>)
    .then((res) =>
      res.studies.map((s) => ({
        ...s,
        sites: [...s.sites].sort((a, b) => {
          const nameA = a.name?.toLowerCase() ?? ''
          const nameB = b.name?.toLowerCase() ?? ''
          if (nameA < nameB) return -1
          if (nameA > nameB) return 1
          return 0
        }),
      }))
    )
    .then((data) => {
      writeCache(SESSION_STORAGE_KEY, JSON.stringify(data))
      return data
    })
}

export function buildStudies() {
  return fetchGearbox('/gearbox/build-studies', {
    method: 'POST',
  }).then((res) => {
    if (!res.ok) {
      throw new Error('build studies failed')
    }
  })
}
