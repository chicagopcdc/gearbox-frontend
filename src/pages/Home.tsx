import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import HomeLandingPage from '../components/HomeLandingPage'
import HomeMatchingPage, {
  HomeMatchingPageProps,
} from '../components/HomeMatchingPage'
import { fetchFenceAccessToken } from '../utils'

type HomeProps = HomeMatchingPageProps & {
  authenticate(username: string, cb?: () => void): void
  isAuthenticated: boolean
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

  return isAuthenticated ? (
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
