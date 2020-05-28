import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Home from './Pages/Home'
import About from './Pages/About'
import Guide from './Pages/Guide'
import Login from './Pages/Login'
import Results from './Pages/Results'
import Trials from './Pages/Trials'

import Navbar from './Components/Navbar'
import Footer from './Components/Footer'

const styles = {
  main: 'flex-1 max-w-screen-lg w-full mx-auto my-8',
  footer: 'flex-shrink-0',
}

function App() {
  const isLogin = window.location.pathname === '/login'

  return (
    <Router>
      <header>{!isLogin && <Navbar />}</header>

      <main className={styles.main}>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>

          <Route path="/login">
            <Login />
          </Route>

          <Route path="/results">
            <Results />
          </Route>

          <Route path="/guide">
            <Guide />
          </Route>

          <Route path="/trials">
            <Trials />
          </Route>

          <Route path="/about">
            <About />
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
