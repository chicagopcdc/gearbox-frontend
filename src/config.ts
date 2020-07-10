import { MatchFormValues, Trial } from './model'

export const biomarkers: string[] = [
  'MECOM(3q26.2)',
  't(6;9)(p23;q34.1)(DEK-NUP214)',
  'Monosomy 7',
  'Monosomy 5/5q-[ERG1(5q31) deleted]',
  'KMT2A(MLL)(11q23.3)',
  'NUP98(11p15.5)',
  '12p abnormalities (ETV6)',
  'ETS FUS-ERG Fusion',
  'FLT3/ITD+ with alleic ratio > 0.1%',
  'CBFA2T3-GLIS2',
  'RAM phenotype',
  'KAT6A(8p11.21) Fusion',
  'Non-KMT2A MLLT10 Fusions',
]

export const labels: { [key: string]: string } = {
  age: 'Patient Age',
  initDiag: 'Initial Disease Diagnosis',
  cnsInvolvement: 'CNS Involvement',
  aiDisease: 'History of Autoimmune Disease',
  drugAllergiesFlag: 'Drug Allergies',
  prevChemoFlag: 'Previous chemotherapy',
  prevRadFlag: 'Previous radiation therapy',
  prevAtra: 'All-trans retinoid acid (ATRA)',
  prevHydroxyurea: 'Hydroxyurea',
  prevSteroids: 'Corticosteriods',
  prevItCyt: 'IT cytarabine',
  prevOther: 'Other antileukemic therapy',
  lvEf: 'Left Ventricular Ejection Fraction (%)',
  secrumCr: 'Baseline serum creatinine (mg/dL)',
  astRecent: 'Most recent AST (U/L)',
  altRecent: 'Most recent ALT (U/L)',
}

export const initialMatchFormValues: MatchFormValues = {
  age: undefined,
  initDiag: undefined,
  cnsInvolvement: undefined,
  aiDisease: undefined,
  drugAllergiesFlag: undefined,
  drugAllergies: undefined,
  prevChemoFlag: undefined,
  prevRadFlag: undefined,
  prevAtra: undefined,
  prevHydroxyurea: undefined,
  prevSteroids: undefined,
  prevItCyt: undefined,
  prevOther: undefined,
  lvEf: undefined,
  secrumCr: undefined,
  astRecent: undefined,
  altRecent: undefined,
  prevChemo: undefined,
  prevRad: undefined,
  biomarkers: undefined,
}

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
      aiDisease: true,
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
      drugAllergiesFlag: false,
      prevChemoFlag: false,
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
      prevChemoFlag: true,
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
      prevRadFlag: true,
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
  },
]
