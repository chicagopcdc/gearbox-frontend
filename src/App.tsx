import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

import Layout from './Layout'
import Home from './pages/Home/Page'
import About from './pages/About'
import Guide from './pages/Guide'
import Login from './pages/Login'
import Terms from './pages/Terms'
import Trials from './pages/Trials'
import MyRoute from './components/MyRoute'
import useAuth from './hooks/useAuth'
import { fetchUserInfo, handleFenceLogout } from './utils'
import {
  EligibilityCriterion,
  MatchCondition,
  MatchFormConfig,
  MatchFormValues,
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
  useEffect(() => {
    if (
      !isAuthenticated &&
      (window.document.referrer === '' ||
        new URL(window.document.referrer).origin !== window.location.origin)
    )
      fetchUserInfo()
        .then(({ username }) => {
          if (username === undefined)
            throw new Error('Error: Missing username!')
          authenticate(username)
        })
        .catch(console.error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  function handleLogout() {
    signout(handleFenceLogout)
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
    if (isAuthenticated) {
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
  }, [isAuthenticated])

  return (
    <Router basename={process.env?.PUBLIC_URL}>
      <Layout {...{ isAuthenticated, username, onLogout: handleLogout }}>
        <Switch>
          <MyRoute path="/" exact isAuthenticated={isAuthenticated}>
            <Home
              isAuthenticated={isAuthenticated}
              homeMatchingPageProps={{
                conditions,
                config,
                criteria,
                studies,
                userInput,
                updateUserInput,
              }}
            />
          </MyRoute>

          <Route path="/login" exact>
            {isAuthenticated ? <Redirect to="/" /> : <Login />}
          </Route>

          <Route path="/guide" exact>
            <Guide />
          </Route>

          <Route path="/trials" exact>
            <Trials studies={studies} />
          </Route>

          <Route path="/about" exact>
            <About />
          </Route>

          <Route path="/terms" exact>
            <Terms />
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
