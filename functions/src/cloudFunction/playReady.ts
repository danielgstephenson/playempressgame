import { createCloudFunction } from "../create/cloudFunction"
import guardPlayerData from "../guard/playerData"
import guardDocData from "../guard/docData"
import { gamesLord, playersLord } from "../db"
import { https } from "firebase-functions/v1"
import { createEvent } from "../create/event"
import { PlayReadyProps } from "../types"
import { arrayUnion, deleteField, increment, query, where } from 'firelord'

const playReady = createCloudFunction<PlayReadyProps>(async (props, context, transaction) => {
  const { currentUid, playerData, playerRef, playerId, profileRef } = await guardPlayerData({
    gameId: props.gameId,
    transaction,
    context
  })
  const gameRef = gamesLord.doc(props.gameId)
  const gameData = await guardDocData({
    docRef: gameRef,
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
  if (waiting) {
    transaction.update(gameRef, {
      readyCount: increment(1),
      history: arrayUnion(
        createEvent(`${playerData.displayName} is ready`)
      )
    })
    transaction.update(playerRef, {
      history: arrayUnion(
        createEvent(`You are ready`)
      )
    })
    transaction.update(profileRef, {
      ready: true
    })
    return
  }
  const whereGameId = where('gameId', '==', props.gameId)
  const whereUserId = where('userId', '==', currentUid)
  const otherPlayersQuery = query(playersLord.collection(), whereGameId, whereUserId)
  const otherPlayers = await transaction.get(otherPlayersQuery)
  function play ({ data: playerData, id }: {
    data: any,
    id: string
  }): void {
    console.log('play id test:', id)
    const playerRef = playersLord.doc(id)
    transaction.update(playerRef, {
      hand: playerData.hand.filter((scheme: any) => scheme.id !== playerData.trashId),
      trashId: deleteField(),
      history: arrayUnion(
        createEvent(`Everyone is ready`)
      ),
    })
  }
  otherPlayers.forEach(otherPlayer => {
    console.log('otherPlayer.id', otherPlayer.id)
    play({ data: otherPlayer.data(), id: otherPlayer.id })
  })
  console.log('context.auth?.uid', context.auth?.uid)
  play({ data: playerData, id: playerId })
  transaction.update(gameRef, {
    history: arrayUnion(
      createEvent(`Everyone is ready`)
    ),
    readyCount: 0
  })
})
export default playReady