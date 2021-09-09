import { useEffect } from 'react'
import ReactGA from 'react-ga'
import type { Location } from 'history'

const gaTrackingId = process.env.REACT_APP_GA_TRACKING_ID ?? ''
const isUsingGoogleAnalytics = /UA-\d+-\d+/.test(gaTrackingId)

if (isUsingGoogleAnalytics) ReactGA.initialize(gaTrackingId)

export default function useGoogleAnalytics(location: Location) {
  useEffect(() => {
    if (isUsingGoogleAnalytics)
      ReactGA.pageview(location.pathname + location.search)
  }, [location])
}
