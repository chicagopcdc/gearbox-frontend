import React from 'react'
import { Link } from 'react-router-dom'

const styles = {
  navbar:
    'flex flex-wrap items-center justify-between border-b-2 border-solid border-black mx-4 px-4',
  navbarLogo: 'flex-2',
  navbarItems: 'flex-1 flex items-center justify-between',
  navbarItem: 'list-none',
}

type NavbarProps = {
  logo: React.ReactElement
  items: { name: string; path: string }[]
}

const Navbar = ({ logo, items }: NavbarProps) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLogo}>
        <Link to="/">{logo}</Link>
      </div>

      <ul className={styles.navbarItems}>
        {items.map(({ path, name }) => (
          <li className={styles.navbarItem}>
            <Link to={path}>{name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navbar
