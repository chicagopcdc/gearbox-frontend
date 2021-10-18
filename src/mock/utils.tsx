import eligibilityCriteria from './eligibilityCriteria.json'
import latestMatchInput from './latestMatchInput.json'
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

export const mockLoadLatestMatchInput = () =>
  Promise.resolve(latestMatchInput).then((fields) =>
    fields.reduce(
      (acc, { id, value }) => ({ ...acc, [id]: value }),
      {} as MatchFormValues
    )
  )

export const mockLoadMatchConditions = () =>
  Promise.resolve(matchConditions as MatchCondition[])

export const mockLoadMatchFormConfig = () =>
  Promise.resolve(matchFormConfig as MatchFormConfig)

export const mockLoadStudies = () => Promise.resolve(studies as Study[])

export const mockPostLatestMatchInput = (values: MatchFormValues) => {
  const matchInput = Object.keys(values).reduce((acc, id) => {
    const value = values[Number(id)]
    return value === undefined || (Array.isArray(value) && value.length === 0)
      ? acc
      : [...acc, { id: Number(id), value }]
  }, [] as { id: number; value: any }[])
  console.log(JSON.stringify(matchInput))

  return Promise.resolve({ status: 200 })
}
