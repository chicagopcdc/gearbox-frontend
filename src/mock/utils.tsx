import eligibilityCriteria from './eligibilityCriteria.json'
import latestUserInput from './latestUserInput.json'
import matchConditions from './matchConditions.json'
import matchFormConfig from './matchFormConfig.json'
import studies from './studies.json'
import { MatchFormValues } from '../model'

export const mockLoadEligibilityCriteria = () =>
  Promise.resolve(eligibilityCriteria)

export const mockLoadLatestUserInput = () =>
  Promise.resolve(latestUserInput).then((fields) =>
    fields.reduce(
      (acc, { id, value }) => ({ ...acc, [id]: value }),
      {} as MatchFormValues
    )
  )

export const mockLoadMatchConditions = () => Promise.resolve(matchConditions)

export const mockLoadMatchFromConfig = () => Promise.resolve(matchFormConfig)

export const mockLoadStudies = () => Promise.resolve(studies)
