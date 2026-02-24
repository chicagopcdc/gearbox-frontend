import { ImportantQuestionConfig } from '../model'
import { fetchGearbox } from './utils'

export function getImportantQuestionsConfig() {
  return fetchGearbox('/gearbox/important-questions')
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
}
