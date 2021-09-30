import type React from 'react'
import { useEffect, useRef, useState } from 'react'

type FieldWrapperProps = {
  children: React.ReactNode
  isShowing?: boolean
}

function FieldWrapper({ children, isShowing = true }: FieldWrapperProps) {
  const baseClassName = 'my-6 transition-colors'
  const [className, setClassName] = useState(baseClassName)

  const prevIsShowing: React.MutableRefObject<boolean | undefined> = useRef()
  useEffect(() => {
    if (
      isShowing &&
      prevIsShowing.current !== undefined &&
      prevIsShowing.current !== isShowing
    ) {
      const timeoutStart = setTimeout(() => {
        setClassName((c) => (c += ' bg-blue-100'))
      }, 100)
      const timeoutEnd = setTimeout(() => {
        setClassName(baseClassName)
      }, 500)
      return () => {
        clearTimeout(timeoutStart)
        clearTimeout(timeoutEnd)
      }
    }
    prevIsShowing.current = isShowing
  }, [isShowing])

  return isShowing ? <div className={className}>{children}</div> : null
}

export default FieldWrapper
