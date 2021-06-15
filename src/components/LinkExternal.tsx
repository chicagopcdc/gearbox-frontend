import type React from 'react'
import { ExternalLink } from 'react-feather'

type LinkExternalProps = {
  className?: string
  children: React.ReactNode
  to: string
}

function LinkExternal({ className, children, to }: LinkExternalProps) {
  return (
    <a className={className} href={to} target="blank" rel="noreferrer">
      {children}
      <sup>
        <ExternalLink className="inline" size="1em" />
      </sup>
    </a>
  )
}

export default LinkExternal
