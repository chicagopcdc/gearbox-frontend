import { fetchGearbox } from './utils'
import { StudyAlgorithmEngine } from '../model'

export function getStudyAlgorithm(id: number) {
  return fetchGearbox('/gearbox/study-algorithm-engine/' + id)
    .then((res) => {
      if (!res.ok) {
        throw new Error(
          `Failed to load algorithm for study ${id} (HTTP ${res.status})`
        )
      }
      return res.json() as Promise<StudyAlgorithmEngine>
    })
    .then((algorithmEngine) => algorithmEngine.algorithm_logic)
}

export function updateStudyAlgorithm(
  studyAlgorithmEngine: StudyAlgorithmEngine,
  eligibilityCriteriaId: number
) {
  return fetchGearbox('/gearbox/update-study-algorithm-engine', {
    method: 'POST',
    body: JSON.stringify({
      ...studyAlgorithmEngine,
      eligibility_criteria_info_id: eligibilityCriteriaId,
    }),
  }).then((res) => {
    if (!res.ok) {
      throw new Error(
        `Failed to update study algorithm (HTTP ${res.status}). Your changes were not saved.`
      )
    }
    return res.json() as Promise<StudyAlgorithmEngine>
  })
}

export function createStudyAlgorithm(
  studyAlgorithmEngine: StudyAlgorithmEngine,
  eligibilityCriteriaId: number,
  studyVersionId: number
) {
  return fetchGearbox('/gearbox/study-algorithm-engine', {
    method: 'POST',
    body: JSON.stringify({
      ...studyAlgorithmEngine,
      eligibility_criteria_id: eligibilityCriteriaId,
      study_version_id: studyVersionId,
      eligibility_criteria_info_id: eligibilityCriteriaId,
    }),
  }).then((res) => {
    if (!res.ok) {
      throw new Error(
        `Failed to create study algorithm (HTTP ${res.status}). The record was not saved.`
      )
    }
    return res.json() as Promise<StudyAlgorithmEngine>
  })
}
