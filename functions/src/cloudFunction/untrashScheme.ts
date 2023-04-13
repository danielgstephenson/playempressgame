import { createCloudFunction } from "../create/cloudFunction"
import guardPlayDocs from "../guard/playDocs"
import { FieldValue } from "firebase-admin/firestore"
import { createEvent } from "../create/event"
import { gamesRef, playersRef } from "../db"

const untrashScheme = createCloudFunction(async (props, context, transaction) => {
  const { playerRef, profileRef, playerData, gameData, currentUid } = await guardPlayDocs({
    gameId: props.gameId,
    transaction,
    context
  })
  console.log(`untrashing scheme...`)
  const untrashScheme = playerData.hand.find( (scheme: any) => scheme.id === props.schemeId)
  transaction.update(playerRef, {
    trashId: FieldValue.delete(),
    history: FieldValue.arrayUnion(
      createEvent(`You returned scheme ${untrashScheme.rank} from your trash`)
    )
  })
  transaction.update(profileRef, {
    trashEmpty: true,
    ready: false
  })
  const gameRef = gamesRef.doc(props.gameId)
  const untrashEvent = createEvent(`${playerData.displayName} returned the scheme from their trash.`)
  transaction.update(gameRef, {
    history: FieldValue.arrayUnion(
      untrashEvent
    )
  })
  gameData.userIds.forEach( (userId : any) => {
    if(userId === currentUid) return
    const playerId = `${userId}_${props.gameId}`
    const playerRef = playersRef.doc(playerId)
    transaction.update(playerRef, {
      history: FieldValue.arrayUnion(untrashEvent)
    })
  })
  console.log('untrashed scheme!')
})
export default untrashScheme