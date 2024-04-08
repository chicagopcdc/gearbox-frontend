import type { MatchCondition } from '../model'
import { fetchGearbox, readCache, writeCache } from './utils'

const SESSION_STORAGE_KEY = 'gearbox:match-conditions'

export function getMatchConditions() {
  const cache = readCache<MatchCondition[]>(SESSION_STORAGE_KEY)
  if (cache !== null) return Promise.resolve(cache)

  return fetchGearbox('/gearbox/match-conditions')
    .then((res) => res.json())
    .then(fetch)
    .then((res) => res.json() as Promise<MatchCondition[]>)
    .then((data) => {
      writeCache(SESSION_STORAGE_KEY, JSON.stringify(data))
      return data
    })
}

export function buildMatchConditions() {
  return fetchGearbox('/gearbox/build-match-conditions', {
    method: 'POST',
  })
}
