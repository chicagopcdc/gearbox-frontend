import React, { useState, useEffect } from 'react'
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

import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import { Trial } from './Components/TrialCard'

import { initPatientInformation } from './config'

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

type MyRouteProps = {
  cb?(): void
  children: React.ReactNode
  isPrivate?: boolean
  exact?: boolean
  path: string
}

const MyRoute = ({ cb, children, isPrivate, ...rest }: MyRouteProps) => {
  useEffect(() => {
    if (cb) cb()
  }, [cb])

  return (
    <Route
      {...rest}
      render={() => {
        return isPrivate && !fakeAuth.isAuthenticated ? (
          <Redirect to={{ pathname: '/login' }} />
        ) : (
          children
        )
      }}
    />
  )
}

function App() {
  const [isLogin, setIsLogin] = useState(false)
  const [information, setInformation] = useState({ ...initPatientInformation })
  const [results] = useState([
    {
      title: 'AML 1021',
      group: 'COG',
      location: 'CHOP (Philadelphia)',
      registerLinks: [
        {
          name: 'Visit website',
          url: 'about:blank',
        },
      ],
    },
    {
      title: 'AML 1021',
      group: 'COG',
      location: 'CHOP (Philadelphia)',
      registerLinks: [
        {
          name: 'Visit website',
          url: 'about:blank',
        },
        {
          name: 'Visit website',
          url: 'about:blank',
        },
      ],
    },
  ])
  const trials: Trial[] = [
    {
      title: 'AML 1021',
      group: 'COG',
      location: 'CHOP (Philadelphia)',
      registerLinks: [
        {
          name: 'Visit website',
          url: 'about:blank',
        },
      ],
    },
    {
      title: 'AML 1021',
      group: 'COG',
      location: 'CHOP (Philadelphia)',
      registerLinks: [
        {
          name: 'Visit website',
          url: 'about:blank',
        },
        {
          name: 'Visit website',
          url: 'about:blank',
        },
      ],
    },
    {
      title: 'AML 1021',
      group: 'COG',
      location: 'CHOP (Philadelphia)',
      registerLinks: [
        {
          name: 'Visit website',
          url: 'about:blank',
        },
      ],
    },
    {
      title: 'AML 1021',
      group: 'COG',
      location: 'CHOP (Philadelphia)',
      registerLinks: [
        {
          name: 'Visit website',
          url: 'about:blank',
        },
        {
          name: 'Visit website',
          url: 'about:blank',
        },
        {
          name: 'Visit website',
          url: 'about:blank',
        },
      ],
    },
    {
      title: 'AML 1021',
      group: 'COG',
      location: 'CHOP (Philadelphia)',
      registerLinks: [
        {
          name: 'Visit website',
          url: 'about:blank',
        },
      ],
    },
  ]

  return (
    <Router>
      <header>{!isLogin && <Navbar />}</header>

      <main className={styles.main}>
        <Switch>
          <MyRoute path="/" exact cb={() => setIsLogin(false)}>
            <Home
              isAuthenticated={fakeAuth.isAuthenticated}
              setInformation={setInformation}
            />
          </MyRoute>

          <MyRoute path="/login" cb={() => setIsLogin(true)}>
            <Login authenticate={fakeAuth.authenticate} />
          </MyRoute>

          <MyRoute path="/results" isPrivate>
            <Results
              data={{
                information,
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
