import ReactGA from 'react-ga4'

const gaTrackingId = process.env.REACT_APP_GA_TRACKING_ID ?? ''
const isUsingGoogleAnalytics =
  gaTrackingId.startsWith('G-') || gaTrackingId.startsWith('UA-')

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
  if (isUsingGoogleAnalytics) {
    ReactGA.initialize(gaTrackingId)
    ReactGA.set({ userId })
  }
}
