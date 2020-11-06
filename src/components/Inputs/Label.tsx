import React from 'react'

type LabelProps = {
  className?: string
  htmlFor: string
  text: string
}

function Label({ text, ...attrs }: LabelProps) {
  return <label {...attrs}>{text}</label>
}

export default Label
