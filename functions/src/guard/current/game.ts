import { https } from 'firebase-functions'
import { Transaction } from 'firelord'
import { usersRef, gamesRef } from '../../db'
import { CurrentGameGuard } from '../../types'
import guardCurrentUid from './uid'
import guardDocData from '../docData'
import guardUserJoined from '../userJoined'

export default async function guardCurrentGame ({ context, gameId, transaction }: {
  context: https.CallableContext
  gameId: string
  transaction: Transaction
}): Promise<CurrentGameGuard> {
  const currentUid = guardCurrentUid({ context })
  const currentGameRef = gamesRef.doc(gameId)
  const currentGameData = await guardDocData({
    docRef: currentGameRef,
    transaction
  })
  guardUserJoined({ gameData: currentGameData, userId: currentUid })
  const currentUserRef = usersRef.doc(currentUid)
  return { currentGameData, currentGameRef, currentUid, currentUserRef }
}
