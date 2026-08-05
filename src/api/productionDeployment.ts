import { fetchGearbox } from './utils'

export const DEPLOY_PRODUCTION_DATA_URL =
  'https://gearbox-dev.pedscommons.org/gearbox/deploy-prod-data'
export const REFRESH_PRODUCTION_DATA_URL =
  'https://gearbox.pedscommons.org/gearbox-middleware/admin/update_json_data'

async function postDeploymentEndpoint(url: string, errorMessage: string) {
  const response = await fetchGearbox(url, {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) throw new Error(errorMessage)
}

export async function deployPublishedTrialsToProduction() {
  await postDeploymentEndpoint(
    DEPLOY_PRODUCTION_DATA_URL,
    'Unable to deploy staged trials to production.'
  )
  await postDeploymentEndpoint(
    REFRESH_PRODUCTION_DATA_URL,
    'The trials were deployed, but the production data could not be refreshed.'
  )
}
