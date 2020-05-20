import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import Home from './Pages/Home'
import About from './Pages/About'
import Guide from './Pages/Guide'
import Login from './Pages/Login'
import Results from './Pages/Results'
import Trials from './Pages/Trials'

import Navbar from './Components/Navbar'

const routes = [
  { component: Home, name: 'Home', path: '/', exact: true, nav: false },
  { component: Results, name: 'Results', path: '/results', nav: false },
  { component: Login, name: 'Login', path: '/login', nav: false },
  { component: Guide, name: 'Guide', path: '/guide', nav: true },
  { component: Trials, name: 'Trials', path: '/trials', nav: true },
  { component: About, name: 'About', path: '/about', nav: true },
]

function App() {
  return (
    <Router>
      <header>
        <Navbar
          logo={
            <Link to="/">
              <img src="https://picsum.photos/300/150" alt="logo" />
            </Link>
          }
          items={routes
            .filter(({ nav }) => nav)
            .map(({ path, name }) => (
              <Link to={path}>{name}</Link>
            ))}
        />
      </header>

      <main>
        <Switch>
          {routes.map(({ exact, path, component }) => (
            <Route exact={exact} path={path}>
              {component}
            </Route>
          ))}
        </Switch>
      </main>
    </Router>
  )
}

export default App
