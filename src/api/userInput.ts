import type { MatchFormValues, UserInput } from '../model'

type LatestUserInputBody =
  | UserInput // exists
  | { detail: string } // does not exists
export function getLatestUserInput() {
  return fetch('/mds/save/latest')
    .then((res) => res.json())
    .then((data: LatestUserInputBody) => {
      if ('results' in data)
        return [
          data.results.reduce(
            (acc, { id, value }) => ({ ...acc, [id]: value }),
            {} as MatchFormValues
          ),
          data.id,
        ] as [MatchFormValues, number | undefined]

      console.error('Failed to fetch the latest saved user input:', data.detail)
      return [{}, undefined] as [MatchFormValues, undefined]
    })
}

export function postUserInput(values: MatchFormValues, id?: number) {
  const data = Object.keys(values).reduce((acc, id) => {
    const value = values[Number(id)]
    return value === undefined || (Array.isArray(value) && value.length === 0)
      ? acc
      : [...acc, { id: Number(id), value }]
  }, [] as { id: number; value: any }[])

  return fetch('/mds/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data, id }),
  })
    .then((res) => res.json() as Promise<UserInput>)
    .then((data) => data.id)
    .catch((err) => {
      console.log('Failed to post the latest saved user input:', err)
      return undefined
    })
}
