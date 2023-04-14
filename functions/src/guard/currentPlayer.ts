import { https } from 'firebase-functions'
import { Transaction } from 'firelord'
import { playersRef, profilesRef } from '../db'
import { PlayerGuard as CurrentPlayerGuard } from '../types'
import guardDocData from './docData'
import guardJoinedGame from './joinedGame'

export default async function guardCurrentPlayer ({
  context, transaction, gameId
}: {
  context: https.CallableContext
  transaction: Transaction
  gameId: string
}): Promise<CurrentPlayerGuard> {
  const { currentUid, gameData, gameRef } = await guardJoinedGame({
    context,
    gameId,
    transaction
  })
  if (gameData.phase !== 'play') {
    throw new https.HttpsError(
      'failed-precondition',
      'This game is not in the play phase.'
    )
  }
  const playerId = `${currentUid}_${gameId}`
  const playerRef = playersRef.doc(playerId)
  const playerData = await guardDocData({
    docRef: playerRef,
    transaction
  })
  const profileRef = profilesRef.doc(playerId)
  return { currentUid, gameData, gameRef, playerRef, playerData, playerId, profileRef }
}
