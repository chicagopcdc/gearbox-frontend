import React from 'react'

type ButtonProps = {
  children: React.ReactNode
  disabled?: boolean
  small?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

const styles = {
  button(disabled?: boolean, small?: boolean) {
    return `bg-primary text-white uppercase px-4 ${
      disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-secondary'
    } ${small ? 'text-xs py-1' : 'py-2'}`
  },
}

const Button = ({ children, disabled, small, ...attrs }: ButtonProps) => (
  <button {...attrs} className={styles.button(disabled, small)}>
    {children}
  </button>
)

export default Button
