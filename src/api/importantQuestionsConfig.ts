import { ImportantQuestionConfig } from '../model'
import { fetchGearbox } from './utils'

export function getImportantQuestionsConfig() {
  return fetchGearbox('/gearbox-middleware/important-questions')
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to get important questions config s3 url.')
      }
      return res.json()
    })
    .then(fetch)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to get important questions config')
      }
      return res.json() as Promise<ImportantQuestionConfig>
    })
    .catch((error) => {
      console.error('Error fetching important questions config:', error)
      return { groups: [] } as ImportantQuestionConfig
    })
}
