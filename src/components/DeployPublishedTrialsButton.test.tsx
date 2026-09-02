import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { deployPublishedTrialsToProduction } from '../api/productionDeployment'
import { DeployPublishedTrialsButton } from './DeployPublishedTrialsButton'

jest.mock('../api/productionDeployment', () => ({
  deployPublishedTrialsToProduction: jest.fn(),
}))

const deployMock = deployPublishedTrialsToProduction as jest.Mock

beforeEach(() => {
  deployMock.mockReset()
  jest.spyOn(window, 'confirm').mockReturnValue(true)
})

afterEach(() => {
  jest.restoreAllMocks()
})

test('confirms and deploys staged trials to production', async () => {
  deployMock.mockResolvedValue(undefined)
  render(<DeployPublishedTrialsButton isSuperAdmin />)

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Deploy staged trials to production',
    })
  )

  expect(window.confirm).toHaveBeenCalled()
  await waitFor(() => expect(deployMock).toHaveBeenCalledTimes(1))
  expect(
    await screen.findByText(
      'Staged trials were deployed and production data was refreshed.'
    )
  ).toBeInTheDocument()
})

test('does not deploy when confirmation is cancelled', () => {
  jest.spyOn(window, 'confirm').mockReturnValue(false)
  render(<DeployPublishedTrialsButton isSuperAdmin />)

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Deploy staged trials to production',
    })
  )

  expect(deployMock).not.toHaveBeenCalled()
})

test('shows an error when deployment fails', async () => {
  deployMock.mockRejectedValue(new Error('Deployment failed.'))
  render(<DeployPublishedTrialsButton isSuperAdmin />)

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Deploy staged trials to production',
    })
  )

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Deployment failed.'
  )
})

test('disables deployment and explains the restriction for regular admins', () => {
  render(<DeployPublishedTrialsButton isSuperAdmin={false} />)

  expect(
    screen.getByRole('button', {
      name: 'Deploy staged trials to production',
    })
  ).toBeDisabled()
  expect(
    screen.getByText(
      'Only super admins can deploy staged trials to production.'
    )
  ).toBeInTheDocument()
})
