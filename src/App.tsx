import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

import Layout from './Layout'
import AboutPage from './pages/AboutPage'
import MatchingPage from './pages/MatchingPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
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
  const { isAuthenticated, isRegistered, user, register, signout } = useAuth()

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
    if (isAuthenticated && isRegistered) {
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
  }, [isAuthenticated, isRegistered])

  return (
    <Router basename={process.env?.PUBLIC_URL}>
      <Layout
        isAuthenticated={isAuthenticated}
        username={user?.username ?? ''}
        onLogout={signout}
      >
        <Switch>
          <Route
            path="/"
            exact
            render={() =>
              isAuthenticated ? (
                isRegistered ? (
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
                ) : (
                  <Redirect to="/register" />
                )
              ) : (
                <LandingPage />
              )
            }
          />
          <Route
            path="/login"
            exact
            render={() =>
              isAuthenticated ? <Redirect to="/" /> : <LoginPage />
            }
          />
          <Route
            path="/register"
            exact
            render={() =>
              isAuthenticated && !isRegistered ? (
                <RegisterPage
                  docsToBeReviewed={user?.docs_to_be_reviewed ?? []}
                  onRegister={register}
                />
              ) : (
                <Redirect to="/" />
              )
            }
          />
          <Route path="/about" exact render={() => <AboutPage />} />
          <Route path="/terms" exact render={() => <TermsPage />} />
          <Route path="*" render={() => <Redirect to={{ pathname: '/' }} />} />
        </Switch>
      </Layout>
    </Router>
  )
}

export default App
