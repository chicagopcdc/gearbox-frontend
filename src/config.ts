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
  prevChemoFlag: 'previous chemotherapy',
  prevRadFlag: 'previous radiation therapy',
  prevAtra: 'all-trans retinoid acid (ATRA)',
  prevHydroxyurea: 'hydroxyurea',
  prevSteroids: 'corticosteriods',
  prevItCyt: 'IT cytarabine',
  prevOther: 'other antileukemic therapy',
  lvEf: 'Left Ventricular Ejection Fraction (%)',
  secrumCr: 'Baseline serum creatinine (mg/dL)',
  astRecent: 'Most recent AST (U/L)',
  altRecent: 'Most recent ALT (U/L)',
}

export const initialPatientInformation = {
  priorTreatmentTherapies: {
    prevChemoFlag: false,
    prevRadFlag: false,
    prevAtra: false,
    prevHydroxyurea: false,
    prevSteroids: false,
    prevItCyt: false,
    prevOther: false,
  },
  organFunction: {
    lvEf: 0,
    secrumCr: 0,
    astRecent: 0,
    altRecent: 0,
  },
  prevChemo: [],
  prevRad: [],
  biomarkers: [],
}

export const dummyTrials = [
  {
    title: 'AML 1021',
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
    title: 'AML 1021',
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
    title: 'AML 1021',
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
