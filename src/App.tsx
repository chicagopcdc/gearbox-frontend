import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import Home from './Pages/Home'
import About from './Pages/About'
import Guide from './Pages/Guide'
import Login from './Pages/Login'
import Results from './Pages/Results'
import Trials from './Pages/Trials'

import Navbar from './Components/Navbar'
import Footer from './Components/Footer'

import gearboxLogo from './assets/gearbox-logo.png'
import uchicagoBSDlogo from './assets/uchicago-BSD-logo.jpg'
import volchenboumLabLogo from './assets/volchenboum-lab-logo.png'
import pedalLogo from './assets/pedal-logo.png'

const routes = [
  { component: Home, name: 'Home', path: '/', exact: true, nav: false },
  { component: Results, name: 'Results', path: '/results', nav: false },
  { component: Login, name: 'Login', path: '/login', nav: false },
  { component: Guide, name: 'Guide for Use', path: '/guide', nav: true },
  { component: Trials, name: 'Eligible Trials', path: '/trials', nav: true },
  { component: About, name: 'About GEARBOx', path: '/about', nav: true },
]

const navbarProps = {
  logo: (
    <Link to="/">
      <img src={gearboxLogo} alt="logo" height="100" />
    </Link>
  ),
  items: routes
    .filter(({ nav }) => nav)
    .map(({ path, name }) => <Link to={path}>{name}</Link>),
}

const footerProps = {
  children: [
    <img src={uchicagoBSDlogo} alt="logo" height="100" />,
    <img src={volchenboumLabLogo} alt="logo" height="100" />,
    <img src={pedalLogo} alt="logo" height="100" />,
  ],
}

function App() {
  return (
    <Router>
      <header>
        <Navbar {...navbarProps} />
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

      <Footer {...footerProps} />
    </Router>
  )
}

export default App
