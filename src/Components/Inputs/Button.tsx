import React from 'react'

type ButtonProps = {
  children: React.ReactNode
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset' | undefined
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

const styles = {
  button(disabled?: boolean) {
    return `border border-solid rounded px-4 py-2 ${
      disabled
        ? 'cursor-not-allowed opacity-50'
        : 'border-black hover:bg-gray-300'
    }`
  },
}

const Button = ({ children, disabled, ...attrs }: ButtonProps) => (
  <button {...attrs} className={styles.button(disabled)}>
    {children}
  </button>
)

export default Button
