import React from 'react'

type LabelProps = {
  className?: string
  htmlFor: string
  text: string
}

const Label = ({ text, ...attrs }: LabelProps) => (
  <label {...attrs}>{text}</label>
)

export default Label
