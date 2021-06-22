import { useEffect, useState } from 'react'

type CurrentScreenSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

function getCurrentSize(width: number): CurrentScreenSize {
  if (width < 381) return '2xs'
  if (width < 640) return 'xs'
  if (width < 768) return 'sm'
  if (width < 1024) return 'md'
  if (width < 1280) return 'lg'
  if (width < 1536) return 'xl'
  return '2xl'
}

function getScreenSize(width: number) {
  const current = getCurrentSize(width)
  switch (current) {
    case '2xs':
      return {
        current,
        xsAndDown: true,
        xsAndUp: false,
        smAndDown: true,
        smAndUp: false,
        mdAndDown: true,
        mdAndUp: false,
        lgAndDown: true,
        lgAndUp: false,
        xlAndDown: true,
        xlAndUp: false,
      }
    case 'xs':
      return {
        current,
        xsAndDown: true,
        xsAndUp: true,
        smAndDown: true,
        smAndUp: false,
        mdAndDown: true,
        mdAndUp: false,
        lgAndDown: true,
        lgAndUp: false,
        xlAndDown: true,
        xlAndUp: false,
      }
    case 'sm':
      return {
        current,
        xsAndDown: false,
        xsAndUp: true,
        smAndDown: true,
        smAndUp: true,
        mdAndDown: true,
        mdAndUp: false,
        lgAndDown: true,
        lgAndUp: false,
        xlAndDown: true,
        xlAndUp: false,
      }
    case 'md':
      return {
        current,
        xsAndDown: false,
        xsAndUp: true,
        smAndDown: false,
        smAndUp: true,
        mdAndDown: true,
        mdAndUp: true,
        lgAndDown: true,
        lgAndUp: false,
        xlAndDown: true,
        xlAndUp: false,
      }
    case 'lg':
      return {
        current,
        xsAndDown: false,
        xsAndUp: true,
        smAndDown: false,
        smAndUp: true,
        mdAndDown: false,
        mdAndUp: true,
        lgAndDown: true,
        lgAndUp: true,
        xlAndDown: true,
        xlAndUp: false,
      }
    case 'xl':
      return {
        current,
        xsAndDown: false,
        xsAndUp: true,
        smAndDown: false,
        smAndUp: true,
        mdAndDown: false,
        mdAndUp: true,
        lgAndDown: false,
        lgAndUp: true,
        xlAndDown: true,
        xlAndUp: false,
      }
    case '2xl':
      return {
        current,
        xsAndDown: false,
        xsAndUp: true,
        smAndDown: false,
        smAndUp: true,
        mdAndDown: false,
        mdAndUp: true,
        lgAndDown: false,
        lgAndUp: true,
        xlAndDown: false,
        xlAndUp: true,
      }
  }
}

export default function useScreenSize() {
  const [screenSize, setScreenSize] = useState(getScreenSize(window.outerWidth))
  function onResize() {
    const newScreenSize = getScreenSize(window.outerWidth)
    if (screenSize.current !== newScreenSize.current)
      setScreenSize(newScreenSize)
  }
  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  })
  return screenSize
}
