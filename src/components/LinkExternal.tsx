import type React from 'react'
import { ExternalLink } from 'react-feather'

type LinkExternalProps = {
  className?: string
  children: React.ReactNode
  to: string
  onClick?: () => void
}

function LinkExternal({ className, children, to, onClick }: LinkExternalProps) {
  return (
    <a
      className={className}
      href={to}
      target="blank"
      rel="noreferrer"
      onClick={onClick}
    >
      {children}
      <sup>
        <ExternalLink className="inline" size="1em" />
      </sup>
    </a>
  )
}

export default LinkExternal
