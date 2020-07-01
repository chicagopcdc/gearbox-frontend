import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

import Home from './Pages/Home'
import About from './Pages/About'
import Guide from './Pages/Guide'
import Login from './Pages/Login'
import Results from './Pages/Results'
import Trials from './Pages/Trials'

import MyRoute from './Components/MyRoute'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import { Trial } from './Components/TrialCard'

import { dummyTrials, initialMatchFormValues } from './config'

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

function App() {
  const [isLogin, setIsLogin] = useState(false)
  const [matchFormValues, setMatchFormValues] = useState({
    ...initialMatchFormValues,
  })
  const [results, setResults] = useState({
    isLoaded: false,
    isError: false,
    trials: [] as Trial[],
  })
  const trials: Trial[] = dummyTrials

  const handleMatchSubmit = (values: any) => {
    setMatchFormValues({ ...values })

    // reset results
    setResults({ isLoaded: false, isError: false, trials: [] })
    setTimeout(() => {
      setResults((prevState) => ({
        ...prevState,
        isLoaded: true,
        trials: dummyTrials.slice(0, 2),
      }))
    }, 1000)
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
              onMatchSubmit={handleMatchSubmit}
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

          <MyRoute
            path="/results"
            isAuthenticated={fakeAuth.isAuthenticated}
            isPrivate
          >
            <Results
              data={{
                information: {
                  priorTreatmentTherapies: {
                    prevChemoFlag: matchFormValues.prevChemoFlag,
                    prevRadFlag: matchFormValues.prevRadFlag,
                    prevAtra: matchFormValues.prevAtra,
                    prevHydroxyurea: matchFormValues.prevHydroxyurea,
                    prevSteroids: matchFormValues.prevSteroids,
                    prevItCyt: matchFormValues.prevItCyt,
                    prevOther: matchFormValues.prevOther,
                  },
                  organFunction: {
                    lvEf: matchFormValues.lvEf,
                    secrumCr: matchFormValues.secrumCr,
                    astRecent: matchFormValues.astRecent,
                    altRecent: matchFormValues.altRecent,
                  },
                  prevChemo: matchFormValues.prevChemo,
                  prevRad: matchFormValues.prevRad,
                  biomarkers: matchFormValues.biomarkers,
                },
                results,
              }}
            />
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
