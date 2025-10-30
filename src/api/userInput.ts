import type { MatchFormValues, UserInputApi, UserInputUi } from '../model'
import { fetchGearbox } from './utils'

type LatestUserInputBody =
  | UserInputApi // exists
  | { detail: string } // does not exist

type AllUserInputsBody = UserInputApi[] | { detail: string }

export function getLatestUserInput(): Promise<UserInputUi> {
  return fetchGearbox('/gearbox/user-input/latest')
    .then((res) => res.json())
    .then((data: LatestUserInputBody) => {
      if ('results' in data) {
        return userInputApiToUi(data)
      }

      console.error('Failed to fetch the latest saved user input:', data.detail)
      return { values: {} as MatchFormValues, id: undefined }
    })
}

export function postUserInput(
  values: MatchFormValues,
  id?: number,
  name?: string
): Promise<UserInputUi> {
  const data = Object.keys(values).reduce((acc, id) => {
    const value = values[Number(id)]
    return value === undefined || (Array.isArray(value) && value.length === 0)
      ? acc
      : [...acc, { id: Number(id), value }]
  }, [] as { id: number; value: any }[])

  return fetchGearbox('/gearbox/user-input', {
    method: 'POST',
    body: JSON.stringify({
      data,
      id,
      name,
    }),
  })
    .then((res) => res.json() as Promise<UserInputApi>)
    .then(userInputApiToUi)
    .catch((err) => {
      throw new Error('Failed to post the latest saved user input:', err)
    })
}

export function getAllUserInput(): Promise<UserInputUi[]> {
  return fetchGearbox('/gearbox/user-input/all')
    .then((res) => res.json())
    .then((data: AllUserInputsBody) => {
      if (Array.isArray(data)) {
        return data.map(userInputApiToUi)
      } else if (data.detail.includes('this endpoint is not active')) {
        throw new Error(`Failed to fetch all user inputs: ${data.detail}`)
      } else if (data.detail.includes('Saved input not found for user')) {
        return []
      }
      throw new Error('Failed to fetch all user inputs')
    })
}

function userInputApiToUi(userInputApi: UserInputApi): UserInputUi {
  return {
    values: userInputApi.results.reduce(
      (acc, { id, value }) => ({ ...acc, [id]: value }),
      {} as MatchFormValues
    ),
    id: userInputApi.id as number,
    name: userInputApi.name || '',
  }
}
