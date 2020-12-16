import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

import Layout from './Layout'
import Home from './pages/Home'
import About from './pages/About'
import Guide from './pages/Guide'
import Login from './pages/Login'
import Trials from './pages/Trials'
import MyRoute from './components/MyRoute'

import {
  EligibilityCriterion,
  MatchDetails,
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
import {
  clearShowIfField,
  getDefaultValues,
  getMatchIds,
  getMatchDetails,
} from './utils'

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
        setConditions((await mockLoadMatchConditions()) as MatchCondition[])
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
  const [matchDetails, setMatchDetails] = useState({} as MatchDetails)
  useEffect(() => {
    if (
      criteria.length > 0 &&
      conditions.length > 0 &&
      config.fields !== undefined
    ) {
      const initData = async () => {
        const defaultValues = getDefaultValues(config)
        setDefaultValues({ ...defaultValues })
        setValues({ ...defaultValues, ...(await mockLoadLatestUserInput()) })

        const matchDetails = getMatchDetails(
          criteria,
          conditions,
          config,
          defaultValues
        )
        setMatchDetails(matchDetails)
        setMatchIds(getMatchIds(matchDetails))
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
  const [isChanging, setIsChanging] = useState(false)
  const signalChange = () => setIsChanging(true)
  const handleMatchFormChange = (newFormValues: MatchFormValues) => {
    const newValues = clearShowIfField(config, defaultValues, newFormValues)

    if (JSON.stringify(newValues) !== JSON.stringify(values)) {
      setValues({ ...newValues })
      const matchDetails = getMatchDetails(
        criteria,
        conditions,
        config,
        newValues
      )
      setMatchDetails(matchDetails)
      setMatchIds(getMatchIds(matchDetails))
      setIsChanging(false)
      mockPostLatestUserInput(newValues)
    }
  }

  return (
    <Router>
      <Layout
        authbarProps={{ isAuthenticated, username, signout }}
        hideHeader={isLogin}
        showExtraFooter={isLogin}
      >
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
              authenticate={authenticate}
              isAuthenticated={isAuthenticated}
              isChanging={isChanging}
              matchFormProps={{
                config,
                defaultValues,
                values,
                onChange: handleMatchFormChange,
                signalChange,
              }}
              MatchResultProps={{
                matchDetails,
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
      </Layout>
    </Router>
  )
}

export default App
