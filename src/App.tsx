import { useState, useEffect } from 'react'
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
import type {
  EligibilityCriterion,
  MatchCondition,
  MatchFormConfig,
  MatchFormValues,
  Study,
} from './model'
import {
  mockLoadEligibilityCriteria,
  mockLoadMatchConditions,
  mockLoadMatchFormConfig,
  mockLoadStudies,
} from './mock/utils'
import { getLatestUserInput, postUserInput } from './api/userInput'

function App() {
  const auth = useAuth()

  const [studies, setStudies] = useState([] as Study[])
  useEffect(() => {
    mockLoadStudies().then(setStudies)
  }, [])

  const [criteria, setCriteria] = useState([] as EligibilityCriterion[])
  const [conditions, setConditions] = useState([] as MatchCondition[])
  const [config, setConfig] = useState({} as MatchFormConfig)
  const [matchInput, setMatchInput] = useState({} as MatchFormValues)
  const [userInputId, setUserInputId] = useState(
    undefined as number | undefined
  )
  const updateMatchInput = (newMatchInput: MatchFormValues) => {
    if (JSON.stringify(newMatchInput) !== JSON.stringify(matchInput)) {
      setMatchInput(newMatchInput)
      postUserInput(newMatchInput, userInputId).then((latestUserInputId) => {
        if (userInputId === undefined) setUserInputId(latestUserInputId)
      })
    }
  }
  useEffect(() => {
    if (auth.isAuthenticated && auth.isRegistered) {
      // load data on login
      Promise.all([
        mockLoadEligibilityCriteria(),
        mockLoadMatchConditions(),
        mockLoadMatchFormConfig(),
        getLatestUserInput(),
      ]).then(
        ([
          criteria,
          conditions,
          config,
          [latestMatchInput, latestUserInputId],
        ]) => {
          setCriteria(criteria)
          setConditions(conditions)
          setConfig(config)
          setMatchInput(latestMatchInput)
          setUserInputId(latestUserInputId)
        }
      )
    } else {
      // clear data on logout
      setCriteria([] as EligibilityCriterion[])
      setConditions([] as MatchCondition[])
      setConfig({} as MatchFormConfig)
      setMatchInput({} as MatchFormValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isAuthenticated, auth.isRegistered])

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
                <MatchingPage
                  {...{
                    conditions,
                    config,
                    criteria,
                    studies,
                    matchInput,
                    updateMatchInput,
                  }}
                />
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
