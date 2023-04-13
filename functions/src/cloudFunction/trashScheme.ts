import { createCloudFunction } from "../create/cloudFunction"
import guardPlayId from "../guard/playId"
import guardPlayDocs from "../guard/playDocs"
import { gamesRef, playersRef } from "../db"
import { firestore } from "firebase-admin"
import { createEvent } from "../create/event"

const trashScheme = createCloudFunction(async (props, context, transaction) => {
  const { playerRef, playerData, profileRef, gameData, currentUid } = await guardPlayDocs({
    gameId: props.gameId,
    transaction,
    context
  })
  guardPlayId({ hand: playerData.hand, id: props.id })
  const gameRef = gamesRef.doc(props.gameId)
  console.log(`trashing scheme with id ${props.id}...`)
  const trashScheme = playerData.hand.find( (scheme: any) => scheme.id === props.id)
  transaction.update(playerRef, {
    trashId: props.id,
    history: firestore.FieldValue.arrayUnion(
      createEvent(`You are trashing scheme ${trashScheme.rank}`)
    )
  })
  transaction.update(profileRef, {
    trashEmpty: false,
    ready: false
  })
  const trashEvent = createEvent(`${playerData.displayName} is trashing a scheme`)
  transaction.update(gameRef, {
    history: firestore.FieldValue.arrayUnion(trashEvent)
  })
  gameData.userIds.forEach( (userId : any) => {
    if(userId === currentUid) return
    const playerId = `${userId}_${props.gameId}`
    const playerRef = playersRef.doc(playerId)
    transaction.update(playerRef, {
      history: firestore.FieldValue.arrayUnion(trashEvent)
    })
  })
  console.log(`trashed scheme with id ${props.id}!`)
})
export default trashScheme