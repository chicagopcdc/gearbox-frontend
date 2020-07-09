import React, { useState } from 'react'
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

import { dummyTrials, initialMatchFormValues } from './config'
import { MatchFormValues, Trial } from './model'

const styles = {
  main: 'flex-1 lg:w-screen-lg mx-4 lg:mx-auto my-8',
  footer: 'flex-shrink-0',
}

// fakeAuth copied from https://reacttraining.com/react-router/web/example/auth-workflow
const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb: () => void) {
    fakeAuth.isAuthenticated = true
    setTimeout(cb, 100) // fake async
  },
  signout(cb: () => void) {
    fakeAuth.isAuthenticated = false
    setTimeout(cb, 100)
  },
}

const getMatchIds = (trials: Trial[], values: MatchFormValues): string[] =>
  trials
    .filter(({ condition }) =>
      condition
        ? Object.keys(condition).every(
            (k) =>
              values.hasOwnProperty(k) && (values as any)[k] === condition[k]
          )
        : true
    )
    .map(({ id }) => id)

function App() {
  const [isLogin, setIsLogin] = useState(false)
  const [matchFormValues, setMatchFormValues] = useState({
    ...initialMatchFormValues,
  })
  const trials = dummyTrials
  const [matchResult, setMatchResult] = useState({
    isLoaded: true,
    isError: false,
    ids: getMatchIds(trials, initialMatchFormValues),
  })

  const handleMatchChange = (values: MatchFormValues) => {
    if (JSON.stringify(matchFormValues) !== JSON.stringify(values)) {
      setMatchFormValues({ ...values })

      // reset match result
      setMatchResult((prevState) => ({
        ...prevState,
        isLoaded: false,
        isError: false,
      }))
      setTimeout(() => {
        setMatchResult((prevState) => ({
          ...prevState,
          isLoaded: true,
          ids: getMatchIds(trials, values),
        }))
      }, 500)
    }
  }

  return (
    <Router>
      <header>{!isLogin && <Navbar />}</header>

      <main className={styles.main}>
        <Switch>
          <MyRoute
            path="/"
            exact
            isAuthenticated={fakeAuth.isAuthenticated}
            cb={() => {
              setIsLogin(false)
            }}
          >
            <Home
              isAuthenticated={fakeAuth.isAuthenticated}
              onMatchChange={handleMatchChange}
              matchResult={matchResult}
              matchFormValues={matchFormValues}
              trials={trials}
            />
          </MyRoute>

          <MyRoute
            path="/login"
            isAuthenticated={fakeAuth.isAuthenticated}
            cb={() => setIsLogin(true)}
          >
            <Login authenticate={fakeAuth.authenticate} />
          </MyRoute>

          <Route path="/guide">
            <Guide />
          </Route>

          <Route path="/trials">
            <Trials data={trials} />
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
