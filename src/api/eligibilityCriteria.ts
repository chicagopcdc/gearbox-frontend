import type { EligibilityCriterion } from '../model'
import { fetchGearbox, readCache, writeCache } from './utils'

const LOCAL_STORAGE_KEY = 'gearbox:eligiblity-criteria'

export function getEligibilityCriteria() {
  const cache = readCache<EligibilityCriterion[]>(LOCAL_STORAGE_KEY)
  if (cache !== null) return Promise.resolve(cache)

  return fetchGearbox('/gearbox/eligibility-criteria')
    .then((res) => res.json())
    .then(fetch)
    .then((res) => res.json() as Promise<EligibilityCriterion[]>)
    .then((data) => {
      writeCache(LOCAL_STORAGE_KEY, JSON.stringify(data))
      return data
    })
}
