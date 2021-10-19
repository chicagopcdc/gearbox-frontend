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

export const mockGetLatestUserInput = () =>
  Promise.resolve(latestUserInput).then(
    (data) =>
      [
        data.results.reduce(
          (acc, { id, value }) => ({ ...acc, [id]: value }),
          {} as MatchFormValues
        ),
        data.id,
      ] as [MatchFormValues, number]
  )

export const mockLoadEligibilityCriteria = () =>
  Promise.resolve(eligibilityCriteria as EligibilityCriterion[])

export const mockLoadMatchConditions = () =>
  Promise.resolve(matchConditions as MatchCondition[])

export const mockLoadMatchFormConfig = () =>
  Promise.resolve(matchFormConfig as MatchFormConfig)

export const mockLoadStudies = () => Promise.resolve(studies as Study[])

export const mockPostUserInput = (values: MatchFormValues, id?: number) => {
  const data = Object.keys(values).reduce((acc, id) => {
    const value = values[Number(id)]
    return value === undefined || (Array.isArray(value) && value.length === 0)
      ? acc
      : [...acc, { id: Number(id), value }]
  }, [] as { id: number; value: any }[])
  console.log(JSON.stringify({ data, id }))

  return Promise.resolve({ status: 200 })
}
