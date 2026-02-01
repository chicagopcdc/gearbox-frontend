// DropdownSection.tsx
import type React from 'react'
import { useMemo, useState } from 'react'
import { ChevronUp, ChevronDown } from 'react-feather'

type DropdownSectionProps = {
  name: string | React.ReactNode
  backgroundColor?: string
  children: React.ReactNode
  isCollapsedAtStart?: boolean // for uncontrolled only
  isOpen?: boolean // controlled
  onToggle?: (next: boolean) => void // controlled
  id?: string // for jump links
  headerClassName?: string // optional styling
}

function DropdownSection({
  name,
  backgroundColor = 'bg-inherit',
  children,
  isCollapsedAtStart,
  isOpen,
  onToggle,
  id,
  headerClassName = 'top-10',
}: DropdownSectionProps) {
  const [internalOpen, setInternalOpen] = useState(!isCollapsedAtStart)
  const open = typeof isOpen === 'boolean' ? isOpen : internalOpen
  const setOpen = (next: boolean) =>
    typeof isOpen === 'boolean' ? onToggle?.(next) : setInternalOpen(next)

  const isFirefox = useMemo(
    () =>
      typeof navigator !== 'undefined' && /Firefox/i.test(navigator.userAgent),
    []
  )

  return (
    <section
      id={id}
      className={`my-4 ${backgroundColor} ${
        isFirefox ? 'transition-inherit' : ''
      }`}
    >
      <div
        className={`flex sticky py-2 justify-between border-b border-solid border-black z-[5] ${backgroundColor} ${headerClassName} ${
          isFirefox ? 'transition-inherit' : ''
        }`}
      >
        <h2 className="font-bold">{name}</h2>
        {open ? (
          <button
            onClick={(e) => {
              e.preventDefault()
              setOpen(false)
            }}
            aria-label="Collapse dropdown"
          >
            <ChevronUp color="#C00" />
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault()
              setOpen(true)
            }}
            aria-label="Expand dropdown"
          >
            <ChevronDown />
          </button>
        )}
      </div>
      {open && <div className="mt-2">{children}</div>}
    </section>
  )
}

export default DropdownSection
