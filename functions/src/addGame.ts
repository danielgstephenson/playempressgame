import { firestore } from 'firebase-admin'
import { logger } from 'firebase-functions'
import store from './store'

export default async function addGame(): Promise<firestore.WriteResult> {
  logger.log('addGame log')
  const games = store.collection('games')
  const document = games.doc()
  const data = {name: 'test'}
  const writeResult = await document.set(data)
  logger.log('writeResult',writeResult)
  return writeResult
}