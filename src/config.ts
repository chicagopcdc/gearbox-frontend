import {
  EligibilityCriterion,
  MatchFormConfig,
  MatchFormValues,
  Study,
} from './model'
import matchFormConfigJson from './matchFormConfig.json'

export const matchFormConfig: MatchFormConfig = matchFormConfigJson

export const matchFormInitialValues: MatchFormValues = matchFormConfig.fields.reduce(
  (acc, { name, type, defaultValue }) => ({
    ...acc,
    [name]: type !== 'checkbox' && type === 'multiselect' ? [] : defaultValue,
  }),
  {}
)

export const dummyEligibilityCriteria: EligibilityCriterion[] = [
  {
    id: 0,
    fieldId: 3,
    fieldValue: 'true',
    studyIds: [0, 4],
  },
  {
    id: 1,
    fieldId: 4,
    fieldValue: 'false',
    studyIds: [1],
  },
  {
    id: 2,
    fieldId: 4,
    fieldValue: 'true',
    studyIds: [4],
  },
  {
    id: 3,
    fieldId: 6,
    fieldValue: 'false',
    studyIds: [1],
  },
  {
    id: 3,
    fieldId: 6,
    fieldValue: 'true',
    studyIds: [2],
  },
  {
    id: 4,
    fieldId: 8,
    fieldValue: 'true',
    studyIds: [3],
  },
]

export const dummyStudies: Study[] = [
  {
    id: 0,
    title: 'AML 1020',
    group: 'COG',
    location: 'CHOP (Philadelphia)',
    registerLinks: [
      {
        name: 'Visit website',
        url: 'about:blank',
      },
    ],
  },
  {
    id: 1,
    title: 'AML 1021',
    group: 'COG',
    location: 'CHOP (Philadelphia)',
    registerLinks: [
      {
        name: 'Visit website',
        url: 'about:blank',
      },
      {
        name: 'Visit website',
        url: 'about:blank',
      },
    ],
  },
  {
    id: 2,
    title: 'AML 1022',
    group: 'COG',
    location: 'CHOP (Philadelphia)',
    registerLinks: [
      {
        name: 'Visit website',
        url: 'about:blank',
      },
    ],
  },
  {
    id: 3,
    title: 'AML 1023',
    group: 'COG',
    location: 'CHOP (Philadelphia)',
    registerLinks: [
      {
        name: 'Visit website',
        url: 'about:blank',
      },
      {
        name: 'Visit website',
        url: 'about:blank',
      },
      {
        name: 'Visit website',
        url: 'about:blank',
      },
    ],
  },
  {
    id: 4,
    title: 'AML 1024',
    group: 'COG',
    location: 'CHOP (Philadelphia)',
    registerLinks: [
      {
        name: 'Visit website',
        url: 'about:blank',
      },
    ],
  },
]
