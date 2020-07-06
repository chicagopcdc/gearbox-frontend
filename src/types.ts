export type Trial = {
  title: string
  group: string
  location: string
  registerLinks: { name: string; url: string }[]
  condition?: { [key: string]: any }
}

export type MatchFormValues = {
  age: number
  initDiag: string
  cnsInvolvement: boolean
  aiDisease: boolean
  drugAllergiesFlag: boolean
  drugAllergies: string[]
  prevChemoFlag: boolean
  prevRadFlag: boolean
  prevAtra: boolean
  prevHydroxyurea: boolean
  prevSteroids: boolean
  prevItCyt: boolean
  prevOther: boolean
  lvEf: number
  secrumCr: number
  astRecent: number
  altRecent: number
  prevChemo: string[]
  prevRad: string[]
  biomarkers: string[]
}
