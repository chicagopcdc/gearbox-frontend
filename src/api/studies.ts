import { Study } from '../model'
import { fetchGearbox } from './utils'

export function getStudies() {
  return fetchGearbox('/gearbox/studies')
    .then((res) => res.json())
    .then(fetch)
    .then((res) => res.json() as Promise<Study[]>)
}
