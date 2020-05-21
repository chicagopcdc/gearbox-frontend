import React from 'react'

const styles = {
  navbar:
    'flex flex-wrap items-center justify-between border-b-2 border-solid border-black mx-4 px-4',
  navbarLogo: 'flex-2',
  navbarItems: 'flex-1 flex items-center justify-between',
  navbarItem: 'list-none',
}

type NavbarProps = {
  logo: React.ReactElement
  items: React.ReactElement[]
}

const Navbar = ({ logo, items }: NavbarProps) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLogo}>{logo}</div>
      <ul className={styles.navbarItems}>
        {items.map((item) => (
          <li className={styles.navbarItem}>{item}</li>
        ))}
      </ul>
    </nav>
  )
}

export default Navbar
