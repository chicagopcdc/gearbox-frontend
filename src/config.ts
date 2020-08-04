import { MatchFormConfig, MatchFormValues, Trial } from './model'
import matchFormConfigJson from './matchFormConfig.json'

export const matchFormConfig: MatchFormConfig = matchFormConfigJson

export const matchFormInitialValues: MatchFormValues = matchFormConfig.fields.reduce(
  (acc, { name, type, defaultValue }) => ({
    ...acc,
    [name]: type !== 'checkbox' && type === 'multiselect' ? [] : defaultValue,
  }),
  {}
)

export const dummyTrials: Trial[] = [
  {
    id: '0',
    title: 'AML 1020',
    group: 'COG',
    location: 'CHOP (Philadelphia)',
    registerLinks: [
      {
        name: 'Visit website',
        url: 'about:blank',
      },
    ],
    condition: {
      aiDisease: 'true',
    },
  },
  {
    id: '1',
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
    condition: {
      drugAllergiesFlag: 'false',
      prevChemoFlag: 'false',
    },
  },
  {
    id: '2',
    title: 'AML 1022',
    group: 'COG',
    location: 'CHOP (Philadelphia)',
    registerLinks: [
      {
        name: 'Visit website',
        url: 'about:blank',
      },
    ],
    condition: {
      prevChemoFlag: 'true',
    },
  },
  {
    id: '3',
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
    condition: {
      prevRadFlag: 'true',
    },
  },
  {
    id: '4',
    title: 'AML 1024',
    group: 'COG',
    location: 'CHOP (Philadelphia)',
    registerLinks: [
      {
        name: 'Visit website',
        url: 'about:blank',
      },
    ],
    condition: {
      aiDisease: 'true',
      drugAllergiesFlag: 'true',
    },
  },
]
