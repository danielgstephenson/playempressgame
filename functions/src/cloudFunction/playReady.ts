import { createCloudFunction } from "../create/cloudFunction"
import guardPlayId from "../guard/playId"
import guardPlayDocs from "../guard/playDocs"
import guardDocData from "../guard/docData"
import { gamesRef, playersRef, profilesRef } from "../db"
import { https } from "firebase-functions/v1"
import { FieldValue } from "firebase-admin/firestore"

const playReady = createCloudFunction(async (props, context, transaction) => {
  const { playerData, playerId, profileRef } = await guardPlayDocs({
    gameId: props.gameId,
    transaction,
    context
  })
  const { docData : gameData } = await guardDocData({
    collectionRef : gamesRef,
    docId: props.gameId,
    transaction
  })
  if (playerData.trashId == null) {
    throw new https.HttpsError(
      'failed-precondition',
      `This player has not trashed a scheme.`
    )
  }
  if (playerData.playId == null) {
    throw new https.HttpsError(
      'failed-precondition',
      `This player has not played a scheme.`
    )
  }
  console.log(`Setting ${context.auth?.uid} ready...`)
  console.log(`${context.auth?.uid} is ready!`)
  console.log('readyCount', gameData.readyCount)
  console.log('userIds.length', gameData.userIds.length)
  const realReadyCount = gameData.readyCount + 1
  console.log('realReadyCount', realReadyCount)
  const waiting = realReadyCount < gameData.userIds.length
  console.log('waiting', waiting)
  const gameRef = gamesRef.doc(props.gameId)
  if (waiting) {
    transaction.update(gameRef, {
      readyCount: FieldValue.increment(1)
    })
    transaction.update(profileRef, {
      ready: true
    })
    return
  }
  const otherPlayersQuery = playersRef
    .where('gameId', '==', props.gameId)
    .where('userId', '!=', context.auth?.uid)
  const otherPlayers = await transaction.get(otherPlayersQuery)
  function play ({ data: playerData, id }: {
    data: any,
    id: string
  }): void {
    console.log('play id test:', id)
    const playerRef = playersRef.doc(id)
    transaction.update(playerRef, {
      hand: playerData.hand.filter((scheme: any) => scheme.id !== playerData.trashId),
      trashId: FieldValue.delete(),
      ready: false
    })
  }
  otherPlayers.forEach(otherPlayer => {
    console.log('otherPlayer.id', otherPlayer.id)
    play({ data: otherPlayer.data(), id: otherPlayer.id })
  })
  console.log('context.auth?.uid', context.auth?.uid)
  play({ data: playerData, id: playerId })
  transaction.update(gameRef, {
    readyCount: 0
  })
})
export default playReady