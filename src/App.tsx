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
import { getDefaultValues, getMatchIds } from './utils'

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
  const [isAuthenticated, username, authenticate, signout] = useFakeAuth()
  const [isLogin, setIsLogin] = useState(false)

  // load data
  const [criteria, setCriteria] = useState([] as EligibilityCriterion[])
  const [conditions, setConditions] = useState([] as MatchCondition[])
  const [config, setConfig] = useState({} as MatchFormConfig)
  useEffect(() => {
    if (isAuthenticated) {
      const loadData = async () => {
        setCriteria(await mockLoadEligibilityCriteria())
        setConditions(await mockLoadMatchConditions())
        setConfig(await mockLoadMatchFromConfig())
      }
      loadData()
    }
  }, [isAuthenticated])

  const [studies, setStudies] = useState([] as Study[])
  useEffect(() => {
    const loadStudies = async () => {
      setStudies(await mockLoadStudies())
    }
    loadStudies()
  }, [])

  // set states derived from data
  const [defaultValues, setDefaultValues] = useState({} as MatchFormValues)
  const [values, setValues] = useState({} as MatchFormValues)
  const [matchIds, setMatchIds] = useState([] as number[])
  useEffect(() => {
    if (
      criteria.length > 0 &&
      conditions.length > 0 &&
      config.fields !== undefined
    ) {
      const initData = async () => {
        const defaultValues = getDefaultValues(config)
        const matchIds = getMatchIds(
          criteria,
          conditions,
          config,
          defaultValues
        )
        setDefaultValues({ ...defaultValues })
        setValues({ ...defaultValues, ...(await mockLoadLatestUserInput()) })
        setMatchIds(matchIds)
      }
      initData()
    }
  }, [criteria, conditions, config])

  // clear data at logout
  useEffect(() => {
    if (!isAuthenticated) {
      const clearData = () => {
        setCriteria([] as EligibilityCriterion[])
        setConditions([] as MatchCondition[])
        setConfig({} as MatchFormConfig)
        setDefaultValues({} as MatchFormValues)
        setValues({} as MatchFormValues)
        setMatchIds([] as number[])
      }
      clearData()
    }
  }, [isAuthenticated])

  // handle MatchForm update
  const [isMatchUpdating, setIsMatchUpdating] = useState(false)
  const handleMatchFormChange = (newValues: MatchFormValues) => {
    if (JSON.stringify(newValues) !== JSON.stringify(values)) {
      setValues({ ...newValues })
      mockPostLatestUserInput(newValues)
      setIsMatchUpdating(true)
      setTimeout(() => {
        setMatchIds(getMatchIds(criteria, conditions, config, newValues))
        setIsMatchUpdating(false)
      }, 100)
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
                config,
                defaultValues,
                values,
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
