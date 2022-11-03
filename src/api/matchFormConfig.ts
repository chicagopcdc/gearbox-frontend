import type { MatchFormConfig } from '../model'
import { fetchGearbox, readCache, writeCache } from './utils'

const LOCAL_STORAGE_KEY = 'gearbox:match-form'

export function getMatchFormConfig() {
  const cache = readCache<MatchFormConfig>(LOCAL_STORAGE_KEY)
  if (cache !== null) return Promise.resolve(cache)

  return fetchGearbox('/gearbox/match-form')
    .then((res) => res.json())
    .then(fetch)
    .then((res) => res.json() as Promise<MatchFormConfig>)
    .then((data) => {
      writeCache(LOCAL_STORAGE_KEY, JSON.stringify(data))
      return data
    })
}
