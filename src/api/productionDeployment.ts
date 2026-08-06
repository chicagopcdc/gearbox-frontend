import { fetchGearbox } from './utils'

async function postDeploymentEndpoint(url: string, errorMessage: string) {
  const response = await fetchGearbox(url, {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) throw new Error(errorMessage)
}

export async function deployPublishedTrialsToProduction() {
  const deployProductionDataUrl =
    window.RUNTIME_CONFIG?.DEPLOY_PRODUCTION_DATA_URL
  const refreshProductionDataUrl =
    window.RUNTIME_CONFIG?.REFRESH_PRODUCTION_DATA_URL

  if (!deployProductionDataUrl || !refreshProductionDataUrl) {
    throw new Error('Production deployment endpoints are not configured.')
  }

  await postDeploymentEndpoint(
    deployProductionDataUrl,
    'Unable to deploy staged trials to production.'
  )
  await postDeploymentEndpoint(
    refreshProductionDataUrl,
    'The trials were deployed, but the production data could not be refreshed.'
  )
}
