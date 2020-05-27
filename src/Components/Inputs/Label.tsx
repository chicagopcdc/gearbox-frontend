import React from 'react'

type LabelProps = {
  className?: string
  text: string
  htmlFor: string
}

const Label = ({ className, text, htmlFor }: LabelProps) => (
  <label className={className} htmlFor={htmlFor}>
    {text}
  </label>
)

export default Label
