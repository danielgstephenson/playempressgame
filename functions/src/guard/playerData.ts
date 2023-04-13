import { https } from "firebase-functions"
import { Transaction } from "firelord"
import { playersLord, profilesLord } from "../db"
import { PlayerGuard } from "../types"
import guardDocData from "./docData"
import guardJoinedGame from "./joinedGame"

export default async function guardPlayerData ({
  context, transaction, gameId
}: {
  context: https.CallableContext
  transaction: Transaction
  gameId: string
}): Promise<PlayerGuard> {
  const { currentUid, gameData } = await guardJoinedGame({
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
  const playerRef = playersLord.doc(playerId)
  const playerData = await guardDocData({
    docRef: playerRef,
    transaction
  })
  const profileRef = profilesLord.doc(playerId)
  return { currentUid, gameData, playerRef, playerData, playerId, profileRef }
}