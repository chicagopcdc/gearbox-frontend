import { EligibilityCriterion, MatchFormConfig, MatchFormValues } from './model'

export const getMatchIds = (
  criteria: EligibilityCriterion[],
  fieldIdToName: { [key: number]: string },
  values: MatchFormValues
): number[] => {
  if (!criteria.length || fieldIdToName !== {} || values !== {}) return []

  const matchStatusById = criteria
    .flatMap(({ fieldId, fieldValue, studyIds }) => {
      const isMatch = fieldValue === values[fieldIdToName[fieldId]]
      return studyIds.map((id) => ({ id, isMatch }))
    })
    .reduce((acc, { id, isMatch }) => {
      const newIsMatch = acc.hasOwnProperty(id) ? acc[id] && isMatch : isMatch
      return { ...acc, [id]: newIsMatch }
    }, {} as { [id: number]: boolean })

  return Object.keys(matchStatusById).reduce(
    (acc, id) => (matchStatusById[Number(id)] ? [...acc, Number(id)] : acc),
    [] as number[]
  )
}

export const getInitialValues = ({ fields }: MatchFormConfig) =>
  fields &&
  fields.reduce(
    (acc, { name, type, defaultValue }) => ({
      ...acc,
      [name]: type !== 'checkbox' && type === 'multiselect' ? [] : defaultValue,
    }),
    {} as MatchFormValues
  )

export const getFieldIdToName = ({ fields }: MatchFormConfig) =>
  fields &&
  fields.reduce(
    (acc, { id, name }) => ({ ...acc, [id]: name }),
    {} as { [key: number]: string }
  )
