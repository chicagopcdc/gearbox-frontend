import React from 'react'

type ButtonProps = {
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset' | undefined
  onclick?: React.MouseEventHandler
}

const Button = ({ children, type, onclick }: ButtonProps) => (
  <button
    className="border border-solid border-black hover:bg-gray-300 rounded px-4 py-2"
    type={type}
    onClick={onclick}
  >
    {children}
  </button>
)

export default Button
