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

export function getCriteria(include_studies?: boolean): Promise<Criterion[]> {
  const url =
    include_studies !== undefined
      ? `/gearbox/criteria?include_studies=${include_studies}`
      : '/gearbox/criteria'
  return fetchGearbox(url)
    .then((res) => res.json() as Promise<{ results: Criterion[] }>)
    .then((res) => res.results)
}
