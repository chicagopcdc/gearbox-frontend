import { InputType } from '../model'
import { fetchGearbox } from './utils'

export function getInputTypes(): Promise<InputType[]> {
  return fetchGearbox('/gearbox/input-types')
    .then((res) => res.json() as Promise<{ results: InputType[] }>)
    .then((res) => res.results)
}
