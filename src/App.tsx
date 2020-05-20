import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import Home from './Pages/Home'
import About from './Pages/About'
import Guide from './Pages/Guide'
import Login from './Pages/Login'
import Results from './Pages/Results'
import Trials from './Pages/Trials'

const routes = [
  { component: Home, name: 'Home', path: '/', exact: true },
  { component: About, name: 'About', path: '/about' },
  { component: Guide, name: 'Guide', path: '/guide' },
  { component: Login, name: 'Login', path: '/login' },
  { component: Results, name: 'Results', path: '/results' },
  { component: Trials, name: 'Trials', path: '/trials' },
]

function App() {
  return (
    <Router>
      <header>
        <nav>
          <ul>
            {routes.map(({ path, name }) => (
              <li>
                <Link to={path}>{name}</Link>
              </li>
            ))}
          </ul>
        </nav>
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
