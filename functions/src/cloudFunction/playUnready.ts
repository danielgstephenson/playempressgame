import { createCloudFunction } from "../create/cloudFunction"
import guardPlayDocs from "../guard/playDocs"
import { gamesRef, playersRef } from "../db"
import { FieldValue } from "firebase-admin/firestore"
import { createEvent } from "../create/event"

const playUnready = createCloudFunction(async (props, context, transaction) => {
  const { playerId, profileRef, playerRef, playerData, gameData, currentUid } = await guardPlayDocs({
    gameId: props.gameId,
    transaction,
    context
  })
  console.log(`Setting ${playerId} unready...`)
  transaction.update(profileRef, {
    ready: false
  })
  const gameRef = gamesRef.doc(props.gameId)
  const unreadyEvent = createEvent(`${playerData.displayName} is not ready`)
  transaction.update(gameRef, {
    readyCount: FieldValue.increment(-1),
    history: FieldValue.arrayUnion(unreadyEvent)
  })
  gameData.userIds.forEach( (userId : any) => {
    if(userId === currentUid) return
    const playerId = `${userId}_${props.gameId}`
    const playerRef = playersRef.doc(playerId)
    transaction.update(playerRef, {
      history: FieldValue.arrayUnion(unreadyEvent)
    })
  })
  transaction.update(playerRef, {
    history: FieldValue.arrayUnion(
      createEvent(`You are not ready`)
    )
  })
  console.log(`${playerId} is unready!`)
})
export default playUnready