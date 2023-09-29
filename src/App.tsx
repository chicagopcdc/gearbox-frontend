import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import Layout from './Layout'
import AboutPage from './pages/AboutPage'
import MatchingPage from './pages/MatchingPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { AdminPage } from './pages/AdminPage'
import DocumentReviewPage from './pages/DocumentReviewPage'
import useAuth from './hooks/useAuth'
import useGearboxData from './hooks/useGearboxData'
import { useGoogleAnalytics } from './hooks/useGoogleAnalytics'
import { ErrorRetry } from './components/ErrorRetry'

function App() {
  const auth = useAuth()
  const gearboxData = useGearboxData(auth)
  const isAdmin = !!auth.user?.is_admin
  const userId = auth.user?.sub ?? ''
  useGoogleAnalytics(userId)

  if (
    auth.loadingStatus === 'not started' ||
    auth.loadingStatus === 'loading'
  ) {
    return <h1>Loading...</h1>
  } else if (auth.loadingStatus === 'error') {
    return <ErrorRetry retry={auth.fetchAuth} />
  }

  return (
    <Router basename={process.env?.PUBLIC_URL}>
      <Layout
        isAuthenticated={auth.isAuthenticated}
        isAdmin={isAdmin}
        username={auth.user?.username ?? ''}
        userId={userId}
        onLogout={auth.signout}
      >
        <Routes>
          <Route
            path="/"
            element={
              !auth.isAuthenticated ? (
                <LandingPage isLLS={false} />
              ) : !auth.isRegistered ? (
                <Navigate to="/register" replace />
              ) : auth.hasDocsToBeReviewed ? (
                <Navigate to="/document-review" replace />
              ) : (
                <MatchingPage {...gearboxData} />
              )
            }
          />
          <Route path="/LLS" element={<LandingPage isLLS={true} />} />
          <Route
            path="/admin"
            element={
              isAdmin ? (
                <AdminPage gearboxState={gearboxData.state} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/login"
            element={
              auth.isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
            }
          />
          <Route
            path="/register"
            element={
              auth.isAuthenticated && !auth.isRegistered ? (
                <RegisterPage
                  docsToBeReviewed={auth.user?.docs_to_be_reviewed ?? []}
                  onRegister={auth.register}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/document-review"
            element={
              auth.hasDocsToBeReviewed ? (
                <DocumentReviewPage
                  docsToBeReviewed={auth.user?.docs_to_be_reviewed ?? []}
                  onReview={auth.reviewDocuments}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
