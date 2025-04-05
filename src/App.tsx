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
import { BooleanLogicBuilderPage } from './pages/BooleanLogicBuilderPage'
import DocumentReviewPage from './pages/DocumentReviewPage'
import useAuth from './hooks/useAuth'
import useGearboxData from './hooks/useGearboxData'
import { useGoogleAnalytics } from './hooks/useGoogleAnalytics'
import { ErrorRetry } from './components/ErrorRetry'
import { AdminPage } from './pages/AdminPage'
import { InputFormBuilderPage } from './pages/InputFormBuilderPage'
import { CriteriaAnnotationVerificationPage } from './pages/CriteriaAnnotationVerificationPage'
import { CriteriaValueAssignmentPage } from './pages/CriteriaValueAssignmentPage'

function App() {
  const auth = useAuth()
  const gearboxData = useGearboxData(auth)
  const gearboxGateway = auth.user?.authz['/gearbox_gateway']
  const isAdmin = !!gearboxGateway && !!gearboxGateway.length
  const userId = auth.user?.sub ?? ''
  useGoogleAnalytics(userId)

  if (
    auth.loadingStatus === 'not started' ||
    auth.loadingStatus === 'sending'
  ) {
    return <h1>Loading...</h1>
  } else if (auth.loadingStatus === 'error') {
    console.error("Authentication failed with status 'error'. Retry attempted."); // Log error for debugging
    return (
      <ErrorRetry
        retry={() => {
          console.log("Retry button clicked, attempting to fetch auth..."); // Log retry action
          auth.fetchAuth(); // Call the retry function
        }}
      />
    );
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
          <Route path="/admin" element={<AdminPage isAdmin={isAdmin} />}>
            <Route
              path="boolean-logic-builder"
              element={
                <BooleanLogicBuilderPage gearboxState={gearboxData.state} />
              }
            />
            <Route
              path="input-form-builder"
              element={<InputFormBuilderPage />}
            />
            <Route
              path="criteria-annotation-verification"
              element={<CriteriaAnnotationVerificationPage />}
            />
            <Route
              path="criteria-value-assignment"
              element={<CriteriaValueAssignmentPage />}
            />
          </Route>
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
