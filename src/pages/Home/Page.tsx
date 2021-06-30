import HomeLandingPage from './HomeLandingPage'
import HomeMatchingPage, { HomeMatchingPageProps } from './HomeMatchingPage'

type HomeProps = {
  isAuthenticated: boolean
  homeMatchingPageProps: HomeMatchingPageProps
}
function Home({ isAuthenticated, homeMatchingPageProps }: HomeProps) {
  return isAuthenticated ? (
    <HomeMatchingPage {...homeMatchingPageProps} />
  ) : (
    <HomeLandingPage />
  )
}

export default Home
