import React from 'react'

const Label = ({ text, htmlFor }: { text: string; htmlFor: string }) => (
  <label className="mr-4" htmlFor={htmlFor}>
    {text}
  </label>
)

export default Label
