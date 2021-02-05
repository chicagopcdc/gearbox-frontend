import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Button from '../components/Inputs/Button'
import MatchForm, { MatchFormProps } from '../components/MatchForm'
import MatchResult, { MatchResultProps } from '../components/MatchResult'
import { fetchFenceAccessToken } from '../utils'

type HomeMatchingPageProps = {
  isChanging: boolean
  matchFormProps: MatchFormProps
  matchResultProps: MatchResultProps
}

type HomeProps = HomeMatchingPageProps & {
  authenticate(username: string, cb?: () => void): void
  isAuthenticated: boolean
}

function HomeLandingPage() {
  return (
    <div className="text-center my-32">
      <p className="text-3xl mb-4">
        Find matching clinical trials with GEARBOx
      </p>
      <Link to="/login">
        <Button size="large">Log in</Button>
      </Link>
    </div>
  )
}

function HomeMatchingPage({
  isChanging,
  matchFormProps,
  matchResultProps,
}: HomeMatchingPageProps) {
  return (
    <div className="md:flex md:justify-between">
      <div className="flex-1 p-4 md:mr-4 lg:mr-8">
        <h1 className="uppercase text-primary font-bold">
          Patient Information
        </h1>
        <MatchForm {...matchFormProps} />
      </div>
      <div
        className={`flex-1 p-4 md:ml-4 lg:lg-8 ${
          isChanging ? 'bg-gray-100' : ''
        }`}
      >
        <h1 className="uppercase text-primary font-bold">Open Trials</h1>
        <MatchResult {...matchResultProps} />
      </div>
    </div>
  )
}

function Home({
  authenticate,
  isAuthenticated,
  isChanging,
  matchFormProps,
  matchResultProps,
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

  return isAuthenticated && isMatchFromDataReady ? (
    <HomeMatchingPage
      isChanging={isChanging}
      matchFormProps={matchFormProps}
      matchResultProps={matchResultProps}
    />
  ) : (
    <HomeLandingPage />
  )
}

export default Home
