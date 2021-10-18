import type { MatchFormValues, UserInput } from '../model'

type LatestUserInputBody =
  | UserInput // exists
  | { detail: string } // does not exists
export function getLatestUserInput() {
  return fetch('/mds/save/latest')
    .then(async (res) => res.json())
    .then((data: LatestUserInputBody) => {
      if ('results' in data)
        return data.results.reduce(
          (acc, { id, value }) => ({ ...acc, [id]: value }),
          {} as MatchFormValues
        )

      console.error('Failed to fetch the latest saved user input:', data.detail)
      return {} as MatchFormValues
    })
}

export function postUserInput(values: MatchFormValues): Promise<UserInput> {
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
    body: JSON.stringify({ data }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log('Failed to post the latest saved user input:', err)
    })
}
