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
import DocumentReviewPage from './pages/DocumentReviewPage'
import TermsPage from './pages/TermsPage'
import useAuth from './hooks/useAuth'
import useGearboxData from './hooks/useGearboxData'

function App() {
  const auth = useAuth()
  const gearboxData = useGearboxData(auth)

  return (
    <Router basename={process.env?.PUBLIC_URL}>
      <Layout
        isAuthenticated={auth.isAuthenticated}
        username={auth.user?.username ?? ''}
        onLogout={auth.signout}
      >
        <Routes>
          <Route
            path="/"
            element={
              !auth.isAuthenticated ? (
                <LandingPage />
              ) : !auth.isRegistered ? (
                <Navigate to="/register" replace />
              ) : auth.hasDocsToBeReviewed ? (
                <Navigate to="/document-review" replace />
              ) : (
                <MatchingPage {...gearboxData} />
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
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
