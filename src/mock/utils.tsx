import eligibilityCriteria from './eligibilityCriteria.json'
import latestUserInput from './latestUserInput.json'
import matchConditions from './matchConditions.json'
import matchFormConfig from './matchFormConfig.json'
import studies from './studies.json'
import { MatchFormValues } from '../model'

export const loadMockEligibilityCriteria = () =>
  Promise.resolve(eligibilityCriteria)

export const loadMockLatestUserInput = () =>
  Promise.resolve(latestUserInput).then((fields) =>
    fields.reduce(
      (acc, { id, value }) => ({ ...acc, [id]: value }),
      {} as MatchFormValues
    )
  )

export const loadMockMatchConditions = () => Promise.resolve(matchConditions)

export const loadMockMatchFromConfig = () => Promise.resolve(matchFormConfig)

export const loadMockStudies = () => Promise.resolve(studies)
