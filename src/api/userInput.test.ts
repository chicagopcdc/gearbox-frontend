import type { MatchFormFieldConfig } from '../model'
import { getAllUserInput, getLatestUserInput, postUserInput } from './userInput'
import { fetchGearbox } from './utils'

jest.mock('./utils', () => ({
  fetchGearbox: jest.fn(),
}))

const mockedFetchGearbox = fetchGearbox as jest.MockedFunction<
  typeof fetchGearbox
>

const fields: MatchFormFieldConfig[] = [
  {
    id: 3,
    groupId: 1,
    type: 'select',
    name: 'disease',
  },
  {
    id: 300,
    groupId: 5,
    type: 'picklist',
    name: 'biomarkers',
  },
]

function response(body: unknown): Response {
  return {
    ok: true,
    status: 200,
    json: async () => body,
  } as Response
}

beforeEach(() => {
  jest.resetAllMocks()
})

test('serializes picklist selections as repeated records', async () => {
  mockedFetchGearbox.mockResolvedValue(
    response({
      id: 6,
      name: '',
      results: [
        { id: 3, value: 1 },
        { id: 300, value: 392 },
        { id: 300, value: 410 },
      ],
    })
  )

  const result = await postUserInput(
    {
      3: 1,
      300: [392, 410],
    },
    fields,
    6,
    ''
  )

  expect(mockedFetchGearbox).toHaveBeenCalledWith(
    '/gearbox-middleware/user-input',
    expect.objectContaining({
      method: 'POST',
      body: expect.any(String),
    })
  )

  const requestInit = mockedFetchGearbox.mock.calls[0][1]
  const requestBody = JSON.parse(String(requestInit?.body))

  expect(requestBody).toEqual({
    data: [
      { id: 3, value: 1 },
      { id: 300, value: 392 },
      { id: 300, value: 410 },
    ],
    id: 6,
    name: '',
  })

  expect(result).toEqual({
    values: {
      3: 1,
      300: [392, 410],
    },
    id: 6,
    name: '',
  })
})

test('groups repeated picklist records when loading the latest input', async () => {
  mockedFetchGearbox.mockResolvedValue(
    response({
      id: 7,
      name: 'Multiple biomarkers',
      results: [
        { id: 300, value: 392 },
        { id: 300, value: 410 },
      ],
    })
  )

  await expect(getLatestUserInput(fields)).resolves.toEqual({
    values: {
      300: [392, 410],
    },
    id: 7,
    name: 'Multiple biomarkers',
  })

  expect(mockedFetchGearbox).toHaveBeenCalledWith(
    '/gearbox-middleware/user-input/latest'
  )
})

test('normalizes one picklist record into an array', async () => {
  mockedFetchGearbox.mockResolvedValue(
    response({
      id: 8,
      name: 'One biomarker',
      results: [{ id: 300, value: 392 }],
    })
  )

  await expect(getLatestUserInput(fields)).resolves.toEqual({
    values: {
      300: [392],
    },
    id: 8,
    name: 'One biomarker',
  })
})

test('omits an empty picklist from the request', async () => {
  mockedFetchGearbox.mockResolvedValue(
    response({
      id: 9,
      name: '',
      results: [],
    })
  )

  const result = await postUserInput(
    {
      300: [],
    },
    fields,
    9,
    ''
  )

  const requestInit = mockedFetchGearbox.mock.calls[0][1]
  const requestBody = JSON.parse(String(requestInit?.body))

  expect(requestBody.data).toEqual([])

  expect(result).toEqual({
    values: {
      300: [],
    },
    id: 9,
    name: '',
  })
})

test('normalizes picklists in every saved input', async () => {
  mockedFetchGearbox.mockResolvedValue(
    response([
      {
        id: 10,
        name: 'Multiple',
        results: [
          { id: 300, value: 392 },
          { id: 300, value: 410 },
        ],
      },
      {
        id: 11,
        name: 'Single',
        results: [{ id: 300, value: 392 }],
      },
    ])
  )

  await expect(getAllUserInput(fields)).resolves.toEqual([
    {
      values: {
        300: [392, 410],
      },
      id: 10,
      name: 'Multiple',
    },
    {
      values: {
        300: [392],
      },
      id: 11,
      name: 'Single',
    },
  ])

  expect(mockedFetchGearbox).toHaveBeenCalledWith(
    '/gearbox-middleware/user-input/all'
  )
})
