import { createCloudFunction } from "../create/cloudFunction"
import guardPlayId from "../guard/playId"
import guardPlayDocs from "../guard/playDocs"
import { firestore } from "firebase-admin"
import { createEvent } from "../create/event"
import { gamesRef, playersRef } from "../db"

const playScheme = createCloudFunction(async (props, context, transaction) => {
  const { playerRef, playerData, profileRef, gameData, currentUid} = await guardPlayDocs({
    gameId: props.gameId,
    transaction,
    context
  })
  guardPlayId({ hand: playerData.hand, id: props.id })
  console.log(`playing scheme with id ${props.id}...`)
  const gameRef = gamesRef.doc(props.gameId)
  const playScheme = playerData.hand.find( (scheme: any) => scheme.id === props.id)
  transaction.update(playerRef, {
    playId: props.id,
    history: firestore.FieldValue.arrayUnion(
      createEvent(`You are playing scheme ${playScheme.rank}`)
    )
  })
  transaction.update(profileRef, {
    playEmpty: false,
    ready: false
  })
  const playEvent = createEvent(`${playerData.displayName} is playing a scheme`)
  transaction.update(gameRef, {
    history: firestore.FieldValue.arrayUnion(
      playEvent
    )
  })
  gameData.userIds.forEach( (userId : any) => {
    if(userId === currentUid) return
    const playerId = `${userId}_${props.gameId}`
    const playerRef = playersRef.doc(playerId)
    transaction.update(playerRef, {
      history: firestore.FieldValue.arrayUnion(playEvent)
    })
  })
  console.log(`played scheme with id ${props.id}!`)
})
export default playScheme