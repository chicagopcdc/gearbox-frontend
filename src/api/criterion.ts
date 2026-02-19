import { fetchGearbox } from './utils'
import { Criterion } from '../model'

export function getCriteriaNotExistInMatchForm(): Promise<Criterion[]> {
  return fetchGearbox('/gearbox/criteria-not-exist-in-match-form')
    .then((res) => res.json() as Promise<{ results: Criterion[] }>)
    .then((res) => res.results)
}

export function getCriterion(id: number): Promise<Criterion> {
  return fetchGearbox('/gearbox/criterion/' + id).then(
    (res) => res.json() as Promise<Criterion>
  )
}

export function getCriteria(): Promise<Criterion[]> {
  return fetchGearbox('/gearbox/criteria')
    .then((res) => res.json() as Promise<{ results: Criterion[] }>)
    .then((res) => res.results)
}
