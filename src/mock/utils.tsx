import eligibilityCriteria from './eligibilityCriteria.json'
import latestUserInput from './latestUserInput.json'
import matchConditions from './matchConditions.json'
import matchFormConfig from './matchFormConfig.json'
import studies from './studies.json'
import type {
  EligibilityCriterion,
  MatchCondition,
  MatchFormConfig,
  MatchFormValues,
  Study,
} from '../model'

export const mockLoadEligibilityCriteria = () =>
  Promise.resolve(eligibilityCriteria as EligibilityCriterion[])

export const mockLoadLatestUserInput = () =>
  Promise.resolve(latestUserInput).then((fields) =>
    fields.reduce(
      (acc, { id, value }) => ({ ...acc, [id]: value }),
      {} as MatchFormValues
    )
  )

export const mockLoadMatchConditions = () =>
  Promise.resolve(matchConditions as MatchCondition[])

export const mockLoadMatchFromConfig = () =>
  Promise.resolve(matchFormConfig as MatchFormConfig)

export const mockLoadStudies = () => Promise.resolve(studies as Study[])

export const mockPostLatestUserInput = (values: MatchFormValues) => {
  const userInput = Object.keys(values).reduce((acc, id) => {
    const value = values[Number(id)]
    return value === undefined || (Array.isArray(value) && value.length === 0)
      ? acc
      : [...acc, { id: Number(id), value }]
  }, [] as { id: number; value: any }[])
  console.log(JSON.stringify(userInput))

  return Promise.resolve({ status: 200 })
}
