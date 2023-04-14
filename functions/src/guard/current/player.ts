import { https } from 'firebase-functions'
import { Transaction } from 'firelord'
import { playersRef, profilesRef } from '../../db'
import { CurrentPlayerGuard } from '../../types'
import guardDocData from '../docData'
import guardCurrentGame from './game'

export default async function guardCurrentPlayer ({
  context, transaction, gameId
}: {
  context: https.CallableContext
  transaction: Transaction
  gameId: string
}): Promise<CurrentPlayerGuard> {
  const { currentUid, currentGameData, currentGameRef } = await guardCurrentGame({
    context,
    gameId,
    transaction
  })
  if (currentGameData.phase !== 'play') {
    throw new https.HttpsError(
      'failed-precondition',
      'This game is not in the play phase.'
    )
  }
  const currentPlayerId = `${currentUid}_${gameId}`
  const currentPlayerRef = playersRef.doc(currentPlayerId)
  const currentPlayerData = await guardDocData({
    docRef: currentPlayerRef,
    transaction
  })
  const currentPlayer = { id: currentPlayerId, ...currentPlayerData }
  const currentProfileRef = profilesRef.doc(currentPlayerId)
  return {
    currentPlayer,
    currentUid,
    currentGameData,
    currentGameRef,
    currentPlayerRef,
    currentPlayerData,
    currentPlayerId,
    currentProfileRef
  }
}
