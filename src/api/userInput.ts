import type {
  MatchFormFieldConfig,
  MatchFormValues,
  UserInputApi,
  UserInputUi,
} from '../model'
import { fetchGearbox } from './utils'

type LatestUserInputBody =
  | UserInputApi // exists
  | { detail: string } // does not exist

type AllUserInputsBody = UserInputApi[] | { detail: string }

type UserInputDataItem = {
  id: number
  value: unknown
}

function getPicklistFieldIds(fields: MatchFormFieldConfig[]): Set<number> {
  return new Set(
    fields.filter((field) => field.type === 'picklist').map((field) => field.id)
  )
}

function getEmptyPicklistValues(
  fields: MatchFormFieldConfig[]
): MatchFormValues {
  return fields.reduce((values, field) => {
    if (field.type === 'picklist') {
      values[field.id] = []
    }

    return values
  }, {} as MatchFormValues)
}

function userInputUiToApi(
  values: MatchFormValues,
  fields: MatchFormFieldConfig[]
): UserInputDataItem[] {
  const picklistFieldIds = getPicklistFieldIds(fields)

  return Object.keys(values).reduce((data, rawId) => {
    const id = Number(rawId)
    const value = values[id]

    if (value === undefined || (Array.isArray(value) && value.length === 0)) {
      return data
    }

    if (picklistFieldIds.has(id)) {
      const selectedValues = Array.isArray(value) ? value : [value]

      return [
        ...data,
        ...selectedValues.map((selectedValue) => ({
          id,
          value: selectedValue,
        })),
      ]
    }

    return [...data, { id, value }]
  }, [] as UserInputDataItem[])
}

export function getLatestUserInput(
  fields: MatchFormFieldConfig[]
): Promise<UserInputUi> {
  return fetchGearbox('/gearbox-middleware/user-input/latest')
    .then((res) => res.json())
    .then((data: LatestUserInputBody) => {
      if ('results' in data) {
        return userInputApiToUi(data, fields)
      }

      console.error('Failed to fetch the latest saved user input:', data.detail)
      return {
        values: getEmptyPicklistValues(fields),
        id: undefined,
      }
    })
}

export function postUserInput(
  values: MatchFormValues,
  fields: MatchFormFieldConfig[],
  id?: number,
  name?: string
): Promise<UserInputUi> {
  const data = userInputUiToApi(values, fields)

  return fetchGearbox('/gearbox-middleware/user-input', {
    method: 'POST',
    body: JSON.stringify({ data, id, name }),
  }).then(async (res) => {
    const body = await res.json().catch(() => null)
    if (!res.ok) {
      const msg =
        (body && (body.detail || body.message)) ||
        'Failed to save your answers.'
      throw new Error(msg)
    }
    return userInputApiToUi(body as UserInputApi, fields)
  })
}

export function getAllUserInput(
  fields: MatchFormFieldConfig[]
): Promise<UserInputUi[]> {
  return fetchGearbox('/gearbox-middleware/user-input/all')
    .then((res) => res.json())
    .then((data: AllUserInputsBody) => {
      if (Array.isArray(data)) {
        return data.map((userInput) => userInputApiToUi(userInput, fields))
      } else if (data.detail.includes('this endpoint is not active')) {
        throw new Error(`Failed to fetch all user inputs: ${data.detail}`)
      } else if (data.detail.includes('Saved input not found for user')) {
        return []
      }
      throw new Error('Failed to fetch all user inputs')
    })
}

function userInputApiToUi(
  userInputApi: UserInputApi,
  fields: MatchFormFieldConfig[]
): UserInputUi {
  const picklistFieldIds = getPicklistFieldIds(fields)
  const values = getEmptyPicklistValues(fields)

  for (const result of userInputApi.results) {
    const id = Number(result.id)

    if (picklistFieldIds.has(id)) {
      const currentValues = values[id]

      values[id] = [
        ...(Array.isArray(currentValues) ? currentValues : []),
        Number(result.value),
      ]
    } else {
      values[id] = result.value
    }
  }

  return {
    values,
    id: userInputApi.id,
    name: userInputApi.name || '',
  }
}
