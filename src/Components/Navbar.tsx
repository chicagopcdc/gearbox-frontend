import React from 'react'
import { NavLink } from 'react-router-dom'

import gearboxLogo from '../assets/gearbox-logo.png'

const styles = {
  navbar:
    'flex flex-wrap items-center justify-between border-b-2 border-solid border-black mx-4 px-4',
  navbarLogo: 'flex-2',
  navbarItems: 'flex-1 flex items-center justify-between',
  navbarItem: 'list-none',
}

const Navbar = ({ items }: { items: { name: string; path: string }[] }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLogo}>
        <NavLink to="/">
          <img src={gearboxLogo} alt="logo" style={{ height: '100px' }} />
        </NavLink>
      </div>

      <ul className={styles.navbarItems}>
        {items.map(({ path, name }) => (
          <li className={styles.navbarItem}>
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
