import { MatchCondition } from '../model'
import { fetchGearbox, readCache, writeCache } from './utils'

const LOCAL_STORAGE_KEY = 'gearbox:match-conditions'

export function getMatchConditions() {
  const cache = readCache<MatchCondition[]>(LOCAL_STORAGE_KEY)
  if (cache !== null) return Promise.resolve(cache)

  return fetchGearbox('/gearbox/match-conditions')
    .then((res) => res.json())
    .then(fetch)
    .then((res) => res.json() as Promise<MatchCondition[]>)
    .then((data) => {
      writeCache(LOCAL_STORAGE_KEY, JSON.stringify(data))
      return data
    })
}
