import type { MatchFormValues, UserInputApi, UserInputUi } from '../model'
import { fetchGearbox } from './utils'

type LatestUserInputBody =
  | UserInputApi // exists
  | { detail: string } // does not exist

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
  currentUserInput: UserInputUi
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
      id: currentUserInput.id,
      name: currentUserInput.name || undefined,
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
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to get all user input')
      }
      return res.json() as Promise<UserInputApi[]>
    })
    .then((data) => data.map(userInputApiToUi))
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
