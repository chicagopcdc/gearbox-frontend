import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Button from '../components/Inputs/Button'
import MatchForm from '../components/MatchForm'
import MatchStatus from '../components/MatchStatus'
import { MatchFormConfig, MatchFormValues, Study } from '../model'
import { fetchFenceAccessToken } from '../utils'

const paragraphs = [
  `A tool built and maintained by the Pediatric Acute Leukemia (PedAL) Group, GEARBOx matches pediatric patients currently on Phase III clinical trials who experience refactory or relapsing disease to new Phase I or Phase II clinical trials based on their personal and clinical data. To see a list of all the trials included in this search, please select "Eligible Trials" above.`,
  `GEARBOx has compiled both a centralized lift of COG-sponsored Phase I and Phase II pediatric acute leukemia trials and a complete index of each study's eligibility criteria. Using these data points, our algorithm matches patients to trials for which they are eligible - streaming the process by which Clinical Research Associates (CRAs) identify and initiate their patients' next step in care.`,
]

type HomeProps = {
  authenticate(username: string, cb?: () => void): void
  isAuthenticated: boolean
  isChanging: boolean
  matchFormProps: {
    config: MatchFormConfig
    defaultValues: MatchFormValues
    values: MatchFormValues
    onChange(values: MatchFormValues): void
    signalChange(): void
  }
  matchStatusProps: {
    matchIds: number[]
    studies: Study[]
  }
}

function Home({
  authenticate,
  isAuthenticated,
  isChanging,
  matchFormProps,
  matchStatusProps,
}: HomeProps) {
  const history = useHistory()
  useEffect(() => {
    const hasAuthCode = window.location.search.match(/code=([-.\w]+)/)

    if (!isAuthenticated && hasAuthCode !== null) {
      history.replace('/')

      const code = hasAuthCode[1]
      fetchFenceAccessToken(code)
        .then((access_token) => {
          const token_payload = atob(access_token.split('.')[1])
          const { context } = JSON.parse(token_payload)
          authenticate(context.user.name)
        })
        .catch(() => console.error('Error: Invalid authorization code!'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isMatchFromDataReady =
    matchFormProps.config.fields !== undefined &&
    Object.keys(matchFormProps.values).length > 0

  return (
    <>
      {paragraphs.map((p, i) => (
        <p className="mb-4" key={i}>
          {p}
        </p>
      ))}

      <hr className="my-8" />

      {isAuthenticated && isMatchFromDataReady ? (
        <div className="md:flex md:justify-between">
          <div className="flex-1 p-4 md:mr-8">
            <h1 className="uppercase text-primary font-bold">
              Patient Information
            </h1>
            <MatchForm {...matchFormProps} />
          </div>
          <div
            className={`flex-1 p-4 md:ml-8 ${isChanging ? 'bg-gray-100' : ''}`}
          >
            <h1 className="uppercase text-primary font-bold">
              Patient Information
            </h1>
            <MatchStatus {...matchStatusProps} />
          </div>
        </div>
      ) : (
        <div className="text-center my-32">
          <p className="text-3xl mb-4">
            Find matching clinical trials with GEARBOx
          </p>
          <Link to="/login">
            <Button size="large">Log in</Button>
          </Link>
        </div>
      )}
    </>
  )
}

export default Home
