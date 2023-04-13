import { createCloudFunction } from "../create/cloudFunction"
import guardPlayerData from "../guard/playerData"
import guardDocData from "../guard/docData"
import { gamesLord, playersLord, profilesLord } from "../db"
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
  const youEvent = createEvent(`You are ready`)
  if (waiting) {
    const readyEvent = createEvent(`${playerData.displayName} is ready`) 
    transaction.update(gameRef, {
      readyCount: increment(1),
      history: arrayUnion(readyEvent)
    })
    gameData.userIds.forEach( (userId : any) => {
      if(userId === currentUid) return
      const playerId = `${userId}_${props.gameId}`
      const playerRef = playersLord.doc(playerId)
      transaction.update(playerRef, {
        history: arrayUnion(readyEvent)
      })
    })
    transaction.update(playerRef, {
      history: arrayUnion(youEvent)
    })
    transaction.update(profileRef, {
      ready: true
    })
    return
  }
  const whereGameId = where('gameId', '==', props.gameId)
  const whereUserId = where('userId', '!=', currentUid)
  const otherPlayersQuery = query(playersLord.collection(), whereGameId, whereUserId)
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
    const playerRef = playersLord.doc(id)
    const current = id === playerId
    const privateEvent = current ? youEvent : createEvent(`${playerData.displayName} is ready`)
    const playEvents = publicEvents.filter(event => event.id !== id).map(event => event.event)
    const trashScheme = playData.hand.find((scheme: any) => scheme.id === playData.trashId)
    const playScheme = playData.hand.find((scheme: any) => scheme.id === playData.playId)
    transaction.update(playerRef, {
      hand: playData.hand.filter((scheme: any) => scheme.id !== playData.trashId),
      trashId: deleteField(),
      history: arrayUnion(
        privateEvent,
        createEvent(`Everyone is ready`),
        createEvent(`You trashed scheme ${trashScheme.rank}`),
        ...playEvents,
        createEvent(`You played scheme ${playScheme.rank}`)
      ),
    })
    const profileRef = profilesLord.doc(id)
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
    history: arrayUnion(
      createEvent(`Everyone is ready`)
    ),
    readyCount: 0
  })
})
export default playReady