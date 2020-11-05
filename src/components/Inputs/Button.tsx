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

const styles = {
  button(disabled: boolean = false, size: ButtonSize = 'normal') {
    const styleForDisabled = this.styleForDisabled(disabled)
    const styleForSize = this.styleForSize(size)

    return `bg-primary text-white uppercase ${styleForDisabled} ${styleForSize}`
  },
  styleForDisabled(disabled: boolean): string {
    return disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-secondary'
  },
  styleForSize(size: ButtonSize): string {
    switch (size) {
      case 'normal':
        return 'px-4 py-2'
      case 'large':
        return 'px-6 py-3 text-xl'
      case 'small':
        return 'px-2 py-1 text-xs'
    }
  },
}

const Button = ({ children, disabled, size, ...attrs }: ButtonProps) => (
  <button {...attrs} className={styles.button(disabled, size)}>
    {children}
  </button>
)

export default Button
