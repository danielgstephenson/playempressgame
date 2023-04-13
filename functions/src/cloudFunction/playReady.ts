import { createCloudFunction } from "../create/cloudFunction"
import guardPlayId from "../guard/playId"
import guardPlayDocs from "../guard/playDocs"
import guardDocData from "../guard/docData"
import { gamesRef, playersRef, profilesRef } from "../db"
import { https } from "firebase-functions/v1"
import { FieldValue } from "firebase-admin/firestore"
import { createEvent } from "../create/event"

const playReady = createCloudFunction(async (props, context, transaction) => {
  const { playerData, playerRef, playerId, profileRef, gameData, currentUid } = await guardPlayDocs({
    gameId: props.gameId,
    transaction,
    context
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
  const youEvent = createEvent(`You are ready`)
  if (waiting) {
    const readyEvent = createEvent(`${playerData.displayName} is ready`) 
    transaction.update(gameRef, {
      readyCount: FieldValue.increment(1),
      history: FieldValue.arrayUnion(readyEvent)
    })
    gameData.userIds.forEach( (userId : any) => {
      if(userId === currentUid) return
      const playerId = `${userId}_${props.gameId}`
      const playerRef = playersRef.doc(playerId)
      transaction.update(playerRef, {
        history: FieldValue.arrayUnion(readyEvent)
      })
    })
    transaction.update(playerRef, {
      history: FieldValue.arrayUnion(youEvent)
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
  const otherPlayersData: any[] = []
  otherPlayers.forEach(otherPlayer => {
    const otherPlayerData = otherPlayer.data()
    otherPlayersData.push({
      id: otherPlayer.id,
      ...otherPlayerData
    })
  })
  const allPlayersData = [...otherPlayersData, { id: playerId, ...playerData }]  
  const publicEvents = allPlayersData.map(player => {
    console.log('player test:', player)
    const playScheme = player.hand.find((scheme: any) => scheme.id === player.playId)
    console.log('playScheme test:', playScheme)
    return {
      id: player.id,
      event: createEvent(`${player.displayName} played scheme ${playScheme.rank}`)
    }
  })
  function play ({ data: playData, id }: {
    data: any,
    id: string
  }): void {
    console.log('play id test:', id)
    const playerRef = playersRef.doc(id)
    const current = id === playerId
    const privateEvent = current ? youEvent : createEvent(`${playerData.displayName} is ready`)
    const playEvents = publicEvents.filter(event => event.id !== id).map(event => event.event)
    const trashScheme = playData.hand.find((scheme: any) => scheme.id === playData.trashId)
    const playScheme = playData.hand.find((scheme: any) => scheme.id === playData.playId)
    transaction.update(playerRef, {
      hand: playData.hand.filter((scheme: any) => scheme.id !== playData.trashId),
      trashId: FieldValue.delete(),
      history: FieldValue.arrayUnion(
        privateEvent,
        createEvent(`Everyone is ready`),
        createEvent(`You trashed scheme ${trashScheme.rank}`),
        ...playEvents,
        createEvent(`You played scheme ${playScheme.rank}`)
      ),
    })
    const profileRef = profilesRef.doc(id)
    if (!current) {
      transaction.update(profileRef, {
        ready: false
      })
    }
  }
  otherPlayers.forEach(otherPlayer => {
    console.log('otherPlayer.id', otherPlayer.id)
    play({ data: otherPlayer.data(), id: otherPlayer.id })
  })
  console.log('context.auth?.uid', context.auth?.uid)
  play({ data: playerData, id: playerId })
  transaction.update(gameRef, {
    history: FieldValue.arrayUnion(
      createEvent(`Everyone is ready`)
    ),
    readyCount: 0
  })
})
export default playReady