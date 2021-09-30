import type React from 'react'

type FieldWrapperProps = {
  children: React.ReactNode
  isShowing?: boolean
}

function FieldWrapper({ children, isShowing = true }: FieldWrapperProps) {
  if (!isShowing) return null
  return <div className="my-6">{children}</div>
}

export default FieldWrapper
