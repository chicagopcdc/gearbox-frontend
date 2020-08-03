export type Trial = {
  id: string
  title: string
  group: string
  location: string
  registerLinks: { name: string; url: string }[]
  condition?: { [key: string]: any }
}

export type MatchFormValues = {
  [key: string]: any
}

export type MatchResult = {
  isLoaded: boolean
  isError: boolean
  ids: string[]
}
