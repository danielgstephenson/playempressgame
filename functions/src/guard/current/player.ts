import { https } from 'firebase-functions'
import { Transaction } from 'firelord'
import { playersRef } from '../../db'
import { CurrentPlayingGuard } from '../../types'
import guardDocData from '../docData'
import guardCurrentGame from './game'
import guardDefined from '../defined'

export default async function guardCurrentPlaying ({
  context, transaction, gameId
}: {
  context: https.CallableContext
  transaction: Transaction
  gameId: string
}): Promise<CurrentPlayingGuard> {
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
  const currentGame = { id: gameId, ...currentGameData }
  const currentPlayerId = `${currentUid}_${gameId}`
  const currentPlayerRef = playersRef.doc(currentPlayerId)
  const currentPlayerData = await guardDocData({
    docRef: currentPlayerRef,
    transaction
  })
  const currentPlayer = { id: currentPlayerId, ...currentPlayerData }
  const foundProfile = currentGameData.profiles.find(profile => profile.userId === currentUid)
  const currentProfile = guardDefined(foundProfile, 'You are not in this game.')
  return {
    currentPlayer,
    currentUid,
    currentGame,
    currentGameRef,
    currentPlayerRef,
    currentPlayerId,
    currentProfile
  }
}
