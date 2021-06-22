import { useEffect, useState } from 'react'

function getScreenSize(width: number) {
  if (width < 381) return '2xs'
  if (width < 640) return 'xs'
  if (width < 768) return 'sm'
  if (width < 1024) return 'md'
  if (width < 1280) return 'lg'
  if (width < 1536) return 'xl'
  return '2xl'
}

export default function useScreenSize() {
  const [screenSize, setScreenSize] = useState(getScreenSize(window.outerWidth))
  function onResize() {
    const newScreenSize = getScreenSize(window.outerWidth)
    if (screenSize !== newScreenSize) setScreenSize(newScreenSize)
  }
  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  })
  return screenSize
}
