import type { EligibilityCriterion } from '../model'
import { fetchGearbox, readCache, writeCache } from './utils'

const SESSION_STORAGE_KEY = 'gearbox:eligiblity-criteria'

export function getEligibilityCriteria() {
  const cache = readCache<EligibilityCriterion[]>(SESSION_STORAGE_KEY)
  if (cache !== null) return Promise.resolve(cache)

  return fetchGearbox('/gearbox/eligibility-criteria')
    .then((res) => res.json())
    .then(fetch)
    .then((res) => res.json() as Promise<EligibilityCriterion[]>)
    .then((data) => {
      writeCache(SESSION_STORAGE_KEY, JSON.stringify(data))
      return data
    })
}

export function getEligibilityCriteriaById(id: number) {
  return fetchGearbox(`/gearbox/eligibility-criteria/${id}`).then(
    (res) => res.json() as Promise<EligibilityCriterion[]>
  )
}

export function buildEligibilityCriteria() {
  return fetchGearbox('/gearbox/build-eligibility-criteria', {
    method: 'POST',
  })
}
