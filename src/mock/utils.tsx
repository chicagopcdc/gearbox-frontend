import eligibilityCriteria from './eligibilityCriteria.json'
import matchConditions from './matchConditions.json'
import matchFormConfig from './matchFormConfig.json'
import studies from './studies.json'

export const loadMockEligibilityCriteria = () =>
  Promise.resolve(eligibilityCriteria)

export const loadMockMatchConditions = () => Promise.resolve(matchConditions)

export const loadMockMatchFromConfig = () => Promise.resolve(matchFormConfig)

export const loadMockStudies = () => Promise.resolve(studies)
