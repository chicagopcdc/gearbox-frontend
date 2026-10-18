import { useEffect } from 'react'
import ReactGA from 'react-ga4'

const gaTrackingId = process.env.REACT_APP_GA_TRACKING_ID ?? ''
const isUsingGoogleAnalytics =
  gaTrackingId.startsWith('G-') || gaTrackingId.startsWith('UA-')

let isInitialized = false

const clickLLSLinkEvent: () => void = () => {
  if (isUsingGoogleAnalytics) {
    ReactGA.event({
      action: 'Click to Forward to LLS form',
      category: 'Study',
      label: 'Click to Forward to LLS form',
    })
  }
}

export const gaEvents = {
  clickLLSLinkEvent,
}

export function useGoogleAnalytics(userId: string) {
  useEffect(() => {
    if (isUsingGoogleAnalytics && !isInitialized) {
      ReactGA.initialize(gaTrackingId)
      isInitialized = true
    }
  }, [])

  useEffect(() => {
    if (isUsingGoogleAnalytics && userId) {
      ReactGA.set({ userId })
    }
  }, [userId])
}
