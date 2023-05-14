import { fetchGearbox } from './utils'
import { StudyAlgorithmEngine } from '../model'

export function getStudyAlgorithm(id: number) {
  return fetchGearbox('/gearbox/study-algorithm-engine/' + id)
    .then((res) => res.json() as Promise<StudyAlgorithmEngine>)
    .then((algorithmEngine) => algorithmEngine.algorithm_logic)
}
