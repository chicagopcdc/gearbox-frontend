import React from 'react'

type ButtonSize = 'normal' | 'large' | 'small'
type ButtonType = 'button' | 'submit' | 'reset'

type ButtonProps = {
  children: React.ReactNode
  disabled?: boolean
  size?: ButtonSize
  type?: ButtonType
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

const styleForSize = {
  normal: 'px-4 py-2',
  large: 'px-6 py-3 text-xl',
  small: 'px-2 py-1 text-xs',
}

const styles = {
  button(disabled?: boolean, size: ButtonSize = 'normal') {
    return `bg-primary text-white uppercase ${
      disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-secondary'
    } ${styleForSize[size]}`
  },
}

const Button = ({ children, disabled, size, ...attrs }: ButtonProps) => (
  <button {...attrs} className={styles.button(disabled, size)}>
    {children}
  </button>
)

export default Button
