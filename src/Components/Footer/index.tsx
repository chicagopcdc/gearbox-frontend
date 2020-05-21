import React from 'react'

const styles = {
  footerContent:
    'flex flex-wrap items-center justify-between border-t-2 border-solid border-black mx-4 py-4',
}

const Footer = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.footerContent}>{children}</div>
}

export default Footer
