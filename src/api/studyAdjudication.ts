import { fetchGearbox } from './utils'
import {
  CriteriaValue,
  StagingCriterionPublish,
  StagingCriterionWithValueList,
  StagingCriterionWithValues,
  StudyVersionAdjudication,
} from '../model'

export function getStudyVersionsAdjudication(): Promise<
  StudyVersionAdjudication[]
> {
  return fetchGearbox('/gearbox/study-versions-adjudication').then(
    (res) => res.json() as Promise<StudyVersionAdjudication[]>
  )
}

export function getCriterionStaging(
  eligibilityCriteriaId: number
): Promise<StagingCriterionWithValueList[]> {
  return fetchGearbox(
    '/gearbox/criterion-staging/' + eligibilityCriteriaId
  ).then((res) => {
    if (res.status === 200) {
      return res.json() as Promise<StagingCriterionWithValueList[]>
    } else {
      throw new Error('Failed to get criterion staging')
    }
  })
}

export function saveStagingCriterion(
  updatedStagingCriterion: StagingCriterionWithValues
): Promise<StagingCriterionWithValues> {
  return fetchGearbox('/gearbox/save-criterion-staging', {
    method: 'POST',
    body: JSON.stringify(updatedStagingCriterion),
  }).then((res) => res.json() as Promise<StagingCriterionWithValues>)
}

export function publishStagingCriterion(
  stagingCriteriaToPublish: StagingCriterionPublish
): Promise<string> {
  return fetchGearbox('/gearbox/criterion-staging-publish', {
    method: 'POST',
    body: JSON.stringify(stagingCriteriaToPublish),
  }).then((res) => {
    if (res.status === 409) {
      throw new Error('Code already exists!')
    }
    if (!res.ok) {
      throw new Error('Failed to publish the criterion')
    }
    return res.json() as Promise<string>
  })
}

export function acceptStagingCriterion(
  id: number
): Promise<StagingCriterionWithValues> {
  return fetchGearbox('/gearbox/accept-criterion-staging/' + id, {
    method: 'POST',
  }).then((res) => res.json() as Promise<StagingCriterionWithValues>)
}

export function getValues(): Promise<CriteriaValue[]> {
  return fetchGearbox('/gearbox/values')
    .then((res) => res.json() as Promise<{ results: CriteriaValue[] }>)
    .then((res) => res.results.filter((v) => !v.is_numeric && v.unit_id === 1))
}

export function createValue(value: CriteriaValue): Promise<CriteriaValue> {
  return fetchGearbox('/gearbox/value', {
    method: 'POST',
    body: JSON.stringify(value),
  }).then((res) => res.json() as Promise<CriteriaValue>)
}
