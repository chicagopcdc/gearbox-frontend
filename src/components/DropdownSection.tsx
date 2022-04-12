import type React from 'react'
import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'react-feather'

type DropdownSectionProps = {
  name: string
  backgroundColor?: string
  children: React.ReactNode
  isCollapsedAtStart?: boolean
}

function DropdownSection({
  name,
  backgroundColor = 'bg-inherit',
  children,
  isCollapsedAtStart,
}: DropdownSectionProps) {
  const [isDropDownOpen, setIsDropDownOpen] = useState(!isCollapsedAtStart)
  const handleOpen = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setIsDropDownOpen(true)
  }
  const handleClose = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setIsDropDownOpen(false)
  }
  const isFirefox = navigator.userAgent.includes('Firefox')
  return (
    <section
      className={`my-4 ${backgroundColor} ${
        isFirefox ? 'transition-inherit' : ''
      }`}
    >
      <div
        className={`flex sticky top-10 py-2 justify-between border-b border-solid border-black z-[5] ${backgroundColor} ${
          isFirefox ? 'transition-inherit' : ''
        }`}
      >
        <h2 className="font-bold">{name}</h2>
        {isDropDownOpen ? (
          <button onClick={handleClose} aria-label="Collapse dropdown">
            <ChevronUp color="#C00" />
          </button>
        ) : (
          <button onClick={handleOpen} aria-label="Expand dropdown">
            <ChevronDown />
          </button>
        )}
      </div>
      {isDropDownOpen && children}
    </section>
  )
}

export default DropdownSection
