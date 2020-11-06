import React from 'react'

type ButtonSize = 'normal' | 'large' | 'small'
type ButtonType = 'button' | 'submit' | 'reset'

type ButtonProps = {
  block?: boolean
  children: React.ReactNode
  disabled?: boolean
  outline?: boolean
  size?: ButtonSize
  type?: ButtonType
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

function Button({
  block = false,
  children,
  disabled = false,
  outline = false,
  size = 'normal',
  type = 'button',
  onClick,
}: ButtonProps) {
  const blockClassName = block ? 'w-full' : ''
  const disabledClassName = disabled ? 'cursor-not-allowed opacity-50' : ''
  const hoverClassName = disabled
    ? ''
    : outline
    ? 'hover:bg-red-100 hover:border-secondary hover:text-secondary'
    : 'hover:bg-secondary'
  const outlineClassName = outline
    ? 'border border-solid border-primary text-primary'
    : 'bg-primary text-white'
  const sizeClassName =
    size === 'normal'
      ? 'px-4 py-2'
      : size === 'large'
      ? 'px-6 py-3 text-xl'
      : size === 'small'
      ? 'px-2 py-1 text-xs'
      : ''
  const className = `uppercase ${blockClassName} ${disabledClassName} ${hoverClassName} ${outlineClassName} ${sizeClassName}`

  const attrs = { className, disabled, type, onClick }
  return <button {...attrs}>{children}</button>
}

export default Button
