import React from 'react'

const styles = {
  box: 'border-2 border-solid border-black my-4 md:mx-4',
  boxNameOuter: 'text-base -mt-4 ml-2 mb-0',
  boxNameInner: 'bg-white px-2',
  boxContent: 'p-4',
}

type BoxProps = {
  name: string
  children?: React.ReactNode
}

const Box = ({ name, children }: BoxProps) => {
  return (
    <div className={styles.box}>
      <h1 className={styles.boxNameOuter}>
        <span className={styles.boxNameInner}>{name}</span>
      </h1>
      {children && <div className={styles.boxContent}>{children}</div>}
    </div>
  )
}

export default Box
