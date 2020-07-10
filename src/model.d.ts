export type Trial = {
  id: string
  title: string
  group: string
  location: string
  registerLinks: { name: string; url: string }[]
  condition?: { [key: string]: any }
}

export type MatchFormValues = {
  age?: number
  initDiag?: string
  cnsInvolvement?: string
  aiDisease?: string
  drugAllergiesFlag?: string
  drugAllergies?: string[]
  prevChemoFlag?: string
  prevRadFlag?: string
  prevAtra?: string
  prevHydroxyurea?: string
  prevSteroids?: string
  prevItCyt?: string
  prevOther?: string
  lvEf?: number
  secrumCr?: number
  astRecent?: number
  altRecent?: number
  prevChemo?: string[]
  prevRad?: string[]
  biomarkers?: string[]
}

export type MatchResult = {
  isLoaded: boolean
  isError: boolean
  ids: string[]
}
