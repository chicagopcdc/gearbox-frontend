import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

import Home from './pages/Home'
import About from './pages/About'
import Guide from './pages/Guide'
import Login from './pages/Login'
import Trials from './pages/Trials'

import MyRoute from './components/MyRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import {
  EligibilityCriterion,
  MatchFormConfig,
  MatchFormValues,
  Study,
} from './model'
import {
  loadMockEligibilityCriteria,
  loadMockMatchFromConfig,
  loadMockStudies,
} from './mock/utils'
import { getInitialValues, getFieldIdToName, getMatchIds } from './utils'

const styles = {
  main: 'flex-1 lg:w-screen-lg mx-4 lg:mx-auto my-8',
  footer: 'flex-shrink-0',
}

// useFakeAuth inspired by https://reacttraining.com/react-router/web/example/auth-workflow
const useFakeAuth = (): [
  boolean,
  string,
  (username: string, cb?: () => void) => void,
  (cb?: () => void) => void
] => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const authenticate = (username: string, cb?: () => void) => {
    setIsAuthenticated(true)
    setUsername(username)
    if (cb) setTimeout(cb, 100) // fake async
  }
  const signout = (cb?: () => void) => {
    setIsAuthenticated(false)
    if (cb) setTimeout(cb, 100)
  }
  return [isAuthenticated, username, authenticate, signout]
}

function App() {
  // handle authentication
  const [isAuthenticated, username, authenticate, signout] = useFakeAuth()
  const [isLogin, setIsLogin] = useState(false)

  // load data
  const [criteria, setCriteria] = useState([] as EligibilityCriterion[])
  const [matchFormConfig, setMatchFormConfig] = useState({} as MatchFormConfig)
  const [studies, setStudies] = useState([] as Study[])
  useEffect(() => {
    const loadData = async () => {
      setCriteria(await loadMockEligibilityCriteria())
      setMatchFormConfig(await loadMockMatchFromConfig())
      setStudies(await loadMockStudies())
    }
    const clearData = () => {
      setCriteria([] as EligibilityCriterion[])
      setMatchFormConfig({} as MatchFormConfig)
      setStudies([] as Study[])
    }
    if (isAuthenticated) loadData()
    else clearData()
  }, [isAuthenticated])

  // set states derived from data
  const [matchFormInitialValues, setMatchFormInitialValues] = useState(
    {} as MatchFormValues
  )
  const [fieldIdToName, setFieldIdToname] = useState(
    {} as { [key: number]: string }
  )
  useEffect(() => {
    setMatchFormInitialValues(getInitialValues(matchFormConfig))
    setFieldIdToname(getFieldIdToName(matchFormConfig))
  }, [matchFormConfig])

  const [matchFormValues, setMatchFormValues] = useState({} as MatchFormValues)
  const [matchIds, setMatchIds] = useState([] as number[])
  useEffect(() => {
    setMatchFormValues({ ...matchFormInitialValues })
    setMatchIds(getMatchIds(criteria, fieldIdToName, matchFormInitialValues))
  }, [matchFormInitialValues]) // eslint-disable-line react-hooks/exhaustive-deps

  // handle MatchForm update
  const [isMatchUpdating, setIsMatchUpdating] = useState(false)
  const handleMatchFormChange = (values: MatchFormValues) => {
    if (JSON.stringify(matchFormValues) !== JSON.stringify(values)) {
      setMatchFormValues({ ...values })
      setIsMatchUpdating(true)
      setTimeout(() => {
        setMatchIds(getMatchIds(criteria, fieldIdToName, values))
        setIsMatchUpdating(false)
      }, 500)
    }
  }

  return (
    <Router>
      <header>
        {!isLogin && (
          <Navbar
            isAuthenticated={isAuthenticated}
            username={username}
            signout={signout}
          />
        )}
      </header>

      <main className={styles.main}>
        <Switch>
          <MyRoute
            path="/"
            exact
            isAuthenticated={isAuthenticated}
            cb={() => {
              setIsLogin(false)
            }}
          >
            <Home
              isAuthenticated={isAuthenticated}
              isMatchUpdating={isMatchUpdating}
              matchFormProps={{
                config: matchFormConfig,
                initialValues: matchFormInitialValues,
                values: matchFormValues,
                onChange: handleMatchFormChange,
              }}
              matchStatusProps={{
                matchIds,
                studies,
              }}
            />
          </MyRoute>

          <MyRoute
            path="/login"
            isAuthenticated={isAuthenticated}
            cb={() => setIsLogin(true)}
          >
            <Login authenticate={authenticate} />
          </MyRoute>

          <Route path="/guide">
            <Guide />
          </Route>

          <Route path="/trials">
            <Trials studies={studies} />
          </Route>

          <Route path="/about">
            <About />
          </Route>

          <Route path="*">
            <Redirect to={{ pathname: '/' }} />
          </Route>
        </Switch>
      </main>

      <footer className={styles.footer}>
        <Footer showExtra={isLogin} />
      </footer>
    </Router>
  )
}

export default App
