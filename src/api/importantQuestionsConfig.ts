import { ImportantQuestionConfig } from '../model'
import { fetchGearbox } from './utils'

export function getImportantQuestionsConfig() {
  return fetchGearbox('/gearbox/important-questions')
    .then((res) => res.json())
    .then(fetch)
    .then((res) => res.json() as Promise<ImportantQuestionConfig>)
}
