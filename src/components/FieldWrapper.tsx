import type React from 'react'
import { useEffect, useRef } from 'react'

type FieldWrapperProps = {
  children: React.ReactNode
  isShowing?: boolean
}

function FieldWrapper({ children, isShowing = true }: FieldWrapperProps) {
  const baseClassName = 'my-4 p-2 transition-colors'
  const prevIsShowing: React.MutableRefObject<boolean | undefined> = useRef()
  const wrapperEl: React.MutableRefObject<HTMLDivElement | null> = useRef(null)
  useEffect(() => {
    if (
      isShowing &&
      prevIsShowing.current !== undefined &&
      prevIsShowing.current !== isShowing
    ) {
      const timeoutStart = setTimeout(() => {
        wrapperEl.current?.classList.add('bg-blue-100')
      }, 100)
      const timeoutEnd = setTimeout(() => {
        wrapperEl.current?.classList.remove('bg-blue-100')
      }, 500)
      return () => {
        clearTimeout(timeoutStart)
        clearTimeout(timeoutEnd)
      }
    }
    prevIsShowing.current = isShowing
  }, [isShowing])

  return isShowing ? (
    <div ref={wrapperEl} className={baseClassName}>
      {children}
    </div>
  ) : null
}

export default FieldWrapper
