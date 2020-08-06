import eligibilityCriteria from './eligibilityCriteria.json'
import matchFormConfig from './matchFormConfig.json'
import studies from './studies.json'

export const loadMockEligibilityCriteria = () =>
  Promise.resolve(eligibilityCriteria)

export const loadMockMatchFromConfig = () => Promise.resolve(matchFormConfig)

export const loadMockStudies = () => Promise.resolve(studies)
