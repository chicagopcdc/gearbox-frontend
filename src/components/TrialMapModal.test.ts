import type { MatchGroups, Study } from '../model'
import { getTrialMapMarkers, groupTrialMapMarkers } from './TrialMapModal'

function buildStudies(studyCount: number): Study[] {
  return Array.from({ length: studyCount }, (_, studyIndex) => {
    const siteCount = 5 + (studyIndex % 6)

    return {
      id: studyIndex + 1,
      code: `STUDY-${studyIndex + 1}`,
      name: `Study ${studyIndex + 1}`,
      create_date: null,
      active: true,
      description: '',
      links: [],
      follow_up_info: null,
      sites: Array.from({ length: siteCount }, (_, siteIndex) => {
        const locationIndex = (studyIndex * 7 + siteIndex) % 100
        const latitude = 30 + Math.floor(locationIndex / 10) * 0.1
        const longitude = -100 + (locationIndex % 10) * 0.1

        return {
          id: studyIndex * 10 + siteIndex + 1,
          name: `Site ${siteIndex + 1}`,
          country: 'United States',
          city: null,
          state: null,
          zip: null,
          create_date: null,
          location_lat: String(latitude),
          location_long: String(longitude),
        }
      }),
    }
  })
}

test('groups 5000 studies with 5-10 sites into nearby map locations', () => {
  const studies = buildStudies(5000)
  const allStudyIds = studies.map(({ id }) => id)
  const matchGroups: MatchGroups = {
    matched: allStudyIds,
    undetermined: [],
    unmatched: [],
  }
  const startedAt = performance.now()

  const markers = getTrialMapMarkers(studies, matchGroups)
  const groupedMarkers = groupTrialMapMarkers(markers)
  const elapsedMilliseconds = performance.now() - startedAt

  expect(markers).toHaveLength(37496)
  expect(groupedMarkers).toHaveLength(100)
  expect(groupedMarkers.every(({ items }) => items.length > 1)).toBe(true)
  expect(elapsedMilliseconds).toBeLessThan(2000)
})
