import { EligibilityCriterion } from '../model'
import { fetchGearbox } from './utils'

export function getEligibilityCriteria() {
  return fetchGearbox('/gearbox/eligibility-criteria')
    .then((res) => res.json())
    .then(fetch)
    .then((res) => res.json() as Promise<EligibilityCriterion[]>)
}
