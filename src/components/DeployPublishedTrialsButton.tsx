import { useState } from 'react'
import { deployPublishedTrialsToProduction } from '../api/productionDeployment'

type DeploymentStatus = 'idle' | 'deploying' | 'success' | 'error'

export function DeployPublishedTrialsButton({
  isSuperAdmin,
}: {
  isSuperAdmin: boolean
}) {
  const [status, setStatus] = useState<DeploymentStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const deployTrials = async () => {
    const confirmed = window.confirm(
      'Deploy all staged trials to production? This will update the live production data.'
    )

    if (!confirmed) return

    setStatus('deploying')
    setErrorMessage('')

    try {
      await deployPublishedTrialsToProduction()
      setStatus('success')
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to deploy staged trials to production.'
      )
      setStatus('error')
    }
  }

  return (
    <div className="mb-4 rounded border border-gray-300 bg-gray-50 p-4">
      <h2 className="mb-1 text-lg font-semibold">Production deployment</h2>
      <p className="mb-3 text-sm text-gray-700">
        Push all staged trials to the live production environment.
      </p>
      <button
        className="rounded bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={!isSuperAdmin || status === 'deploying'}
        onClick={deployTrials}
        type="button"
      >
        {status === 'deploying'
          ? 'Deploying staged trials…'
          : 'Deploy staged trials to production'}
      </button>
      {!isSuperAdmin && (
        <p className="mt-3 text-sm text-gray-600">
          Only super admins can deploy staged trials to production.
        </p>
      )}
      {status === 'success' && (
        <p className="mt-3 text-sm text-green-700" role="status">
          Staged trials were deployed and production data was refreshed.
        </p>
      )}
      {status === 'error' && (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
