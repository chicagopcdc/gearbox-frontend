import { useEffect } from 'react'
import ReactGA from 'react-ga'
import type { Location } from 'react-router-dom'

const gaTrackingId = process.env.REACT_APP_GA_TRACKING_ID ?? ''
const isUsingGoogleAnalytics = /UA-\d+-\d+/.test(gaTrackingId)

if (isUsingGoogleAnalytics) ReactGA.initialize(gaTrackingId)

function useGoogleAnalytics(location: Location) {
  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search)
  }, [location])
}

export default isUsingGoogleAnalytics
  ? useGoogleAnalytics
  : () => {
      /* noop */
    }
