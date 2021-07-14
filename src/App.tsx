import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

import Layout from './Layout'
import AboutPage from './pages/AboutPage'
import GuidePage from './pages/GuidePage'
import MatchingPage from './pages/MatchingPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TermsPage from './pages/TermsPage'
import TrialsPage from './pages/TrialsPage'
import useAuth from './hooks/useAuth'
import { fetchUserData, handleFenceLogout } from './utils'
import type {
  EligibilityCriterion,
  MatchCondition,
  MatchFormConfig,
  MatchFormValues,
  RegisterDocument,
  Study,
} from './model'
import {
  mockLoadEligibilityCriteria,
  mockLoadMatchConditions,
  mockLoadMatchFromConfig,
  mockLoadStudies,
  mockLoadLatestUserInput,
  mockPostLatestUserInput,
} from './mock/utils'

function App() {
  const [studies, setStudies] = useState([] as Study[])
  useEffect(() => {
    mockLoadStudies().then(setStudies)
  }, [])

  const [isAuthenticated, username, authenticate, signout] = useAuth()
  const [isRegistered, setIsRegistered] = useState(false)
  const [docsToBeReviewed, setDocsTobeReviewed] = useState<RegisterDocument[]>(
    []
  )
  useEffect(() => {
    if (
      !isAuthenticated &&
      (window.document.referrer === '' ||
        new URL(window.document.referrer).origin !== window.location.origin)
    )
      fetchUserData()
        .then((user) => {
          if (user.username === undefined)
            throw new Error('Error: Missing username!')
          authenticate(user.username)
          setIsRegistered(user.authz?.['/portal']?.length > 0)
          setDocsTobeReviewed(user.docs_to_be_reviewed ?? [])
        })
        .catch(console.error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  function handleLogout() {
    signout(handleFenceLogout)
  }
  function handleRegister() {
    setIsRegistered(true)
  }

  const [criteria, setCriteria] = useState([] as EligibilityCriterion[])
  const [conditions, setConditions] = useState([] as MatchCondition[])
  const [config, setConfig] = useState({} as MatchFormConfig)
  const [userInput, setUserInput] = useState({} as MatchFormValues)
  const updateUserInput = (newUserInput: MatchFormValues) => {
    if (JSON.stringify(newUserInput) !== JSON.stringify(userInput)) {
      setUserInput(newUserInput)
      mockPostLatestUserInput(newUserInput)
    }
  }
  useEffect(() => {
    if (isAuthenticated && isRegistered) {
      // load data on login
      Promise.all([
        mockLoadEligibilityCriteria(),
        mockLoadMatchConditions(),
        mockLoadMatchFromConfig(),
        mockLoadLatestUserInput(),
      ]).then(([criteria, conditions, config, latestUserInput]) => {
        setCriteria(criteria)
        setConditions(conditions)
        setConfig(config)
        setUserInput(latestUserInput)
      })
    } else {
      // clear data on logout
      setCriteria([] as EligibilityCriterion[])
      setConditions([] as MatchCondition[])
      setConfig({} as MatchFormConfig)
      setUserInput({} as MatchFormValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isRegistered])

  return (
    <Router basename={process.env?.PUBLIC_URL}>
      <Layout {...{ isAuthenticated, username, onLogout: handleLogout }}>
        <Switch>
          <Route path="/" exact>
            {isAuthenticated ? (
              isRegistered ? (
                <MatchingPage
                  {...{
                    conditions,
                    config,
                    criteria,
                    studies,
                    userInput,
                    updateUserInput,
                  }}
                />
              ) : (
                <Redirect to="/register" />
              )
            ) : (
              <LandingPage />
            )}
          </Route>

          <Route path="/login" exact>
            {isAuthenticated ? <Redirect to="/" /> : <LoginPage />}
          </Route>

          <Route path="/register" exact>
            {isAuthenticated && !isRegistered ? (
              <RegisterPage
                docsToBeReviewed={docsToBeReviewed}
                onRegister={handleRegister}
              />
            ) : (
              <Redirect to="/" />
            )}
          </Route>

          <Route path="/guide" exact>
            <GuidePage />
          </Route>

          <Route path="/trials" exact>
            <TrialsPage studies={studies} />
          </Route>

          <Route path="/about" exact>
            <AboutPage />
          </Route>

          <Route path="/terms" exact>
            <TermsPage />
          </Route>

          <Route path="*">
            <Redirect to={{ pathname: '/' }} />
          </Route>
        </Switch>
      </Layout>
    </Router>
  )
}

export default App
