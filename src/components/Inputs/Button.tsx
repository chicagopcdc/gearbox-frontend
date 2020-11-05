import React from 'react'

type ButtonSize = 'normal' | 'large' | 'small'
type ButtonType = 'button' | 'submit' | 'reset'

type ButtonProps = {
  children: React.ReactNode
  disabled?: boolean
  outline?: boolean
  size?: ButtonSize
  type?: ButtonType
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

const styles = {
  button(disabled = false, outline = false, size: ButtonSize = 'normal') {
    const styleForDisabled = this.styleForDisabled(disabled)
    const styleForHover = this.styleForHover(disabled, outline)
    const styleForOutline = this.styleForOutline(outline)
    const styleForSize = this.styleForSize(size)

    return `uppercase ${styleForDisabled} ${styleForHover} ${styleForOutline} ${styleForSize}`
  },
  styleForDisabled(disabled: boolean): string {
    return disabled ? 'cursor-not-allowed opacity-50' : ''
  },
  styleForHover(disabled: boolean, outline: boolean): string {
    if (disabled) return ''
    return outline
      ? 'hover:border-secondary hover:text-secondary hover:bg-red-100'
      : 'hover:bg-secondary'
  },
  styleForOutline(outline: boolean): string {
    return outline
      ? 'text-primary border border-solid border-primary'
      : 'bg-primary text-white'
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

const Button = ({
  children,
  disabled,
  outline,
  size,
  type,
  onClick,
}: ButtonProps) => {
  const attrs = { disabled, type, onClick }
  return (
    <button {...attrs} className={styles.button(disabled, outline, size)}>
      {children}
    </button>
  )
}

export default Button
