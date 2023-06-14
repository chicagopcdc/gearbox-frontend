import ReactGA from 'react-ga4'

const gaTrackingId = process.env.REACT_APP_GA_TRACKING_ID ?? ''
const isUsingGoogleAnalytics =
  gaTrackingId.startsWith('G-') || gaTrackingId.startsWith('UA-')

export function useGoogleAnalytics() {
  if (isUsingGoogleAnalytics) {
    ReactGA.initialize(gaTrackingId)
  }
}
