import type React from 'react'
import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'react-feather'

type DropdownSectionProps = {
  name: string
  children: React.ReactNode
  isCollapsedAtStart?: boolean
}

function DropdownSection({
  name,
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
  return (
    <section className="my-4">
      <div className="flex sticky top-10 bg-white py-2 justify-between border-b border-solid border-black">
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
      {isDropDownOpen && <div className="mx-2">{children}</div>}
    </section>
  )
}

export default DropdownSection
