import type { StudyVersionAdjudication } from '../model'
import { getStudyVersions } from './studyVersions'
import { fetchGearbox } from './utils'
import {
  getAdminStudyVersionGroups,
  getStudyVersionsAdjudication,
} from './studyAdjudication'

jest.mock('./studyVersions', () => ({
  getStudyVersions: jest.fn(),
}))
jest.mock('./utils', () => ({
  fetchGearbox: jest.fn(),
}))

const mockedGetStudyVersions = getStudyVersions as jest.MockedFunction<
  typeof getStudyVersions
>
const mockedFetchGearbox = fetchGearbox as jest.MockedFunction<
  typeof fetchGearbox
>

function studyVersion(
  id: number,
  studyId: number,
  code: string,
  status: StudyVersionAdjudication['status']
): StudyVersionAdjudication {
  return {
    id,
    study_version_num: 1,
    status,
    eligibility_criteria_id: id * 10,
    study_algorithm_engine_id: null,
    study: {
      id: studyId,
      code,
      name: `${code} study`,
      create_date: null,
      active: status === 'ACTIVE',
      description: '',
      links: [],
      sites: [],
      follow_up_info: null,
    },
  }
}

beforeEach(() => {
  jest.resetAllMocks()
})

afterEach(() => {
  jest.restoreAllMocks()
})

test('lists studies needing input first and excludes their published version', async () => {
  const needsInput = [
    studyVersion(2, 2, 'TRIAL-10', 'NEW'),
    studyVersion(1, 1, 'TRIAL-2', 'IN_PROCESS'),
  ]
  mockedFetchGearbox.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => needsInput,
  } as Response)
  mockedGetStudyVersions.mockResolvedValue([
    studyVersion(3, 3, 'TRIAL-20', 'ACTIVE'),
    studyVersion(4, 1, 'TRIAL-2', 'ACTIVE'),
  ])

  await expect(getAdminStudyVersionGroups()).resolves.toEqual({
    needsInput: [needsInput[1], needsInput[0]],
    published: [expect.objectContaining({ id: 3 })],
  })
  expect(mockedGetStudyVersions).toHaveBeenCalledWith('ACTIVE')
})

test('treats a missing adjudication list as an empty list', async () => {
  const logInfo = jest.spyOn(console, 'info').mockImplementation(() => {})
  mockedFetchGearbox.mockResolvedValue({
    status: 404,
    statusText: 'Not Found',
  } as Response)

  await expect(getStudyVersionsAdjudication()).resolves.toEqual([])
  expect(logInfo).toHaveBeenCalledWith(
    'No studies requiring adjudication were found',
    {
      endpoint: '/gearbox/study-versions-adjudication',
      status: 404,
      statusText: 'Not Found',
    }
  )
})

test('logs endpoint and HTTP details when adjudication loading fails', async () => {
  const logError = jest.spyOn(console, 'error').mockImplementation(() => {})
  mockedFetchGearbox.mockResolvedValue({
    ok: false,
    status: 503,
    statusText: 'Service Unavailable',
  } as Response)

  await expect(getStudyVersionsAdjudication()).rejects.toThrow(
    'Failed to get studies requiring input (503 Service Unavailable)'
  )
  expect(logError).toHaveBeenCalledWith(
    'Failed to load studies requiring adjudication',
    expect.objectContaining({
      endpoint: '/gearbox/study-versions-adjudication',
      error: expect.any(Error),
    })
  )
})
