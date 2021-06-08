import type React from 'react'

const styles = {
  box: 'border-2 border-solid border-black my-4 md:mx-4',
  boxNameOuter: 'text-base -mt-4 ml-2 mb-0',
  boxNameInner: 'bg-white px-2',
  boxContent: 'p-4',
}

type BoxProps = {
  name: string
  children?: React.ReactNode
  innerClassName?: string
  outerClassName?: string
}

const Box = ({ name, children, innerClassName, outerClassName }: BoxProps) => {
  return (
    <div className={`${styles.box} ${outerClassName}`}>
      <h1 className={styles.boxNameOuter}>
        <span className={styles.boxNameInner}>{name}</span>
      </h1>
      {children && (
        <div className={`${styles.boxContent} ${innerClassName}`}>
          {children}
        </div>
      )}
    </div>
  )
}

export default Box
