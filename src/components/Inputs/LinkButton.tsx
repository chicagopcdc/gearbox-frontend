import type React from 'react'
import { Link } from 'react-router-dom'

type LinkButtonSize = 'normal' | 'large' | 'small'

type LinkButtonProps = {
  to: string
  block?: boolean
  children: React.ReactNode
  outline?: boolean
  size?: LinkButtonSize
}

function LinkButton({
  to = '/',
  block = false,
  children,
  outline = false,
  size = 'normal',
}: LinkButtonProps) {
  const blockClassName = block ? 'w-full' : ''
  const hoverClassName = outline
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
  const className = `inline-flex items-center tracking-wider uppercase ${blockClassName} ${hoverClassName} ${outlineClassName} ${sizeClassName}`

  return to.startsWith('http') ? (
    <a className={className} href={to} target="_blank" rel="noreferrer">
      {children}
    </a>
  ) : (
    <Link className={className} to={to}>
      {children}
    </Link>
  )
}

export default LinkButton
