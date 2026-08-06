import { deployPublishedTrialsToProduction } from './productionDeployment'

const deployProductionDataUrl = 'https://dev.example/deploy'
const refreshProductionDataUrl = 'https://prod.example/refresh'

beforeEach(() => {
  global.fetch = jest.fn()
  window.RUNTIME_CONFIG = {
    DEPLOY_PRODUCTION_DATA_URL: deployProductionDataUrl,
    REFRESH_PRODUCTION_DATA_URL: refreshProductionDataUrl,
  }
  Object.defineProperty(document, 'cookie', {
    configurable: true,
    value: 'csrftoken=test-token',
  })
})

test('deploys staged trials and then refreshes production data', async () => {
  const fetchMock = global.fetch as jest.Mock
  fetchMock.mockResolvedValueOnce({ ok: true, status: 200 })
  fetchMock.mockResolvedValueOnce({ ok: true, status: 200 })

  await deployPublishedTrialsToProduction()

  expect(fetchMock).toHaveBeenNthCalledWith(
    1,
    deployProductionDataUrl,
    expect.objectContaining({ method: 'POST', credentials: 'include' })
  )
  expect(fetchMock).toHaveBeenNthCalledWith(
    2,
    refreshProductionDataUrl,
    expect.objectContaining({ method: 'POST', credentials: 'include' })
  )
})

test('does not refresh production when deploying staged trials fails', async () => {
  const fetchMock = global.fetch as jest.Mock
  fetchMock.mockResolvedValueOnce({ ok: false, status: 500 })

  await expect(deployPublishedTrialsToProduction()).rejects.toThrow(
    'Unable to deploy staged trials to production.'
  )
  expect(fetchMock).toHaveBeenCalledTimes(1)
})

test('reports when deployment succeeds but the production refresh fails', async () => {
  const fetchMock = global.fetch as jest.Mock
  fetchMock.mockResolvedValueOnce({ ok: true, status: 200 })
  fetchMock.mockResolvedValueOnce({ ok: false, status: 500 })

  await expect(deployPublishedTrialsToProduction()).rejects.toThrow(
    'The trials were deployed, but the production data could not be refreshed.'
  )
})

test('does not deploy when runtime endpoint configuration is missing', async () => {
  window.RUNTIME_CONFIG = {}

  await expect(deployPublishedTrialsToProduction()).rejects.toThrow(
    'Production deployment endpoints are not configured.'
  )
  expect(global.fetch).not.toHaveBeenCalled()
})
