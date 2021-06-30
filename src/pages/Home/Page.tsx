import { useEffect } from 'react'
import { fetchUserInfo } from '../../utils'
import HomeLandingPage from './HomeLandingPage'
import HomeMatchingPage, { HomeMatchingPageProps } from './HomeMatchingPage'

type HomeProps = {
  authenticate(username: string, cb?: () => void): void
  isAuthenticated: boolean
  homeMatchingPageProps: HomeMatchingPageProps
}
function Home({
  authenticate,
  isAuthenticated,
  homeMatchingPageProps,
}: HomeProps) {
  useEffect(() => {
    fetchUserInfo()
      .then(({ username }) => {
        if (username === undefined) throw new Error('Error: Missing username!')
        authenticate(username)
      })
      .catch(console.error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return isAuthenticated ? (
    <HomeMatchingPage {...homeMatchingPageProps} />
  ) : (
    <HomeLandingPage />
  )
}

export default Home
