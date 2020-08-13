import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Box from '../components/Box'
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

const Home = ({
  authenticate,
  isAuthenticated,
  isChanging,
  matchFormProps,
  matchStatusProps,
}: HomeProps) => {
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

      {isAuthenticated && isMatchFromDataReady ? (
        <div className="mt-16 md:flex">
          <Box
            name="Patient Information"
            outerClassName="md:max-w-3/5"
            innerClassName="px-8"
          >
            <MatchForm {...matchFormProps} />
          </Box>

          <Box
            name="Open Trials"
            outerClassName={`md:flex-grow ${isChanging ? 'bg-gray-200' : ''}`}
          >
            <MatchStatus {...matchStatusProps} />
          </Box>
        </div>
      ) : (
        <div className="text-center my-8">
          <Link to="/login">
            <Button>Log in to find matching clinical trials</Button>
          </Link>
        </div>
      )}
    </>
  )
}

export default Home
