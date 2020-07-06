export type Trial = {
  title: string
  group: string
  location: string
  registerLinks: { name: string; url: string }[]
  condition?: { [key: string]: any }
}
