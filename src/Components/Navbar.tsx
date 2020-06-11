import React from 'react'
import { NavLink } from 'react-router-dom'

import gearboxLogo from '../assets/gearbox-logo.png'

const styles = {
  navbar:
    'md:flex md:flex-wrap md:items-center md:justify-between border-b-2 border-solid border-black mx-4 px-4 mb-4',
  navbarLogo: 'flex justify-center md:justify-start md:flex-1 xl:flex-2',
  navbarItems: 'text-center md:flex-1 flex items-center justify-between',
  navbarItem: 'list-none hover:text-red-500 p-4',
}

const navItems = [
  { name: 'Guide for Use', path: '/guide' },
  { name: 'Eligible Trials', path: '/trials' },
  { name: 'About GEARBOx', path: '/about' },
]

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLogo}>
        <NavLink to="/">
          <img
            src={gearboxLogo}
            alt="GEARBOx logo"
            style={{ maxHeight: '100px' }}
          />
        </NavLink>
      </div>

      <ul className={styles.navbarItems}>
        {navItems.map(({ path, name }) => (
          <li className={styles.navbarItem} key={path}>
            <NavLink to={path} activeClassName="text-red-500">
              {name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navbar
