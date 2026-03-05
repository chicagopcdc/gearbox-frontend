import {
  CriterionStagingWithValueList,
  CriterionStagingWithValues,
  CriterionStagingPublish,
} from '../model'
import { fetchGearbox } from './utils'

export function getCriterionStaging(
  eligibilityCriteriaId: number
): Promise<CriterionStagingWithValueList[]> {
  return fetchGearbox(
    '/gearbox/criterion-staging/' + eligibilityCriteriaId
  ).then((res) => {
    if (res.status === 404) {
      return []
    }
    if (!res.ok) {
      throw new Error('Failed to get criterion staging')
    }
    return res.json() as Promise<CriterionStagingWithValueList[]>
  })
}

export function saveCriterionStaging(
  updatedCriterionStaging: CriterionStagingWithValues
): Promise<CriterionStagingWithValues> {
  return fetchGearbox('/gearbox/save-criterion-staging', {
    method: 'POST',
    body: JSON.stringify(updatedCriterionStaging),
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((error) => {
        throw new Error(error.message || 'Server error')
      })
    }
    // Response is OK, parse as JSON and return the data
    return res.json() as Promise<CriterionStagingWithValues>
  })
}

export function publishCriterionStaging(
  criterionStagingToPublish: CriterionStagingPublish
): Promise<string> {
  return fetchGearbox('/gearbox/criterion-staging-publish-criterion', {
    method: 'POST',
    body: JSON.stringify(criterionStagingToPublish),
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

export function acceptCriterionStaging(
  id: number
): Promise<CriterionStagingWithValues> {
  return fetchGearbox('/gearbox/accept-criterion-staging/' + id, {
    method: 'POST',
  }).then((res) => res.json() as Promise<CriterionStagingWithValues>)
}

export function updateCriterionStaging(
  criterionStaging: CriterionStagingWithValues
): Promise<CriterionStagingWithValues> {
  return fetchGearbox('/gearbox/update-criterion-staging', {
    method: 'POST',
    body: JSON.stringify(criterionStaging),
  }).then((response) => {
    if (!response.ok) {
      return response.json().then((errorData) => {
        const errorMessage =
          errorData.message ||
          `Failed to update criterion staging (status: ${response.status})`
        throw new Error(errorMessage)
      })
    }
    return response.json() as Promise<CriterionStagingWithValues>
  })
}

export function ignoreCriterionStaging(id: number): Promise<string> {
  return fetchGearbox('/gearbox/ignore-criterion-staging/' + id, {
    method: 'POST',
  }).then(async (res) => {
    // try to read the body (FastAPI errors are usually JSON)
    const contentType = res.headers.get('content-type') ?? ''
    const body: any = contentType.includes('application/json')
      ? await res.json().catch(() => null)
      : await res.text().catch(() => '')

    if (!res.ok) {
      // build a useful message from FastAPI-style errors
      const msg = Array.isArray(body?.detail)
        ? body.detail.join(' ')
        : body?.detail
        ? String(body.detail)
        : body?.message
        ? String(body.message)
        : typeof body === 'string' && body
        ? body
        : `Request failed (${res.status})`

      const err: any = new Error(msg)
      err.status = res.status
      err.body = body
      throw err
    }

    // success case: return whatever your endpoint returns (string or JSON)
    return typeof body === 'string' ? body : JSON.stringify(body)
  })
}
