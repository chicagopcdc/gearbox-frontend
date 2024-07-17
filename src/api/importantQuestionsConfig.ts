import { ImportantQuestionConfig } from '../model'
import { fetchGearbox } from './utils'

export function getImportantQuestionsConfig() {
  return fetchGearbox(
    'https://test-compose-gearbox-data-bucket-with-versioning.s3.amazonaws.com/important_questions.json?AWSAccessKeyId=&Expires=1721249859'
  ).then((res) => res.json() as Promise<ImportantQuestionConfig>)
}
