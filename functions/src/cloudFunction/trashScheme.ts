import { createCloudFunction } from "../create/cloudFunction"
import guardPlayId from "../guard/playId"
import guardPlayDocs from "../guard/playDocs"
import { gamesRef } from "../db"
import { firestore } from "firebase-admin"
import { createEvent } from "../create/event"

const trashScheme = createCloudFunction(async (props, context, transaction) => {
  const { playerRef, playerData, profileRef } = await guardPlayDocs({
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
      createEvent(`You trashed scheme ${trashScheme.rank}`)
    )
  })
  transaction.update(profileRef, {
    trashEmpty: false,
    ready: false
  })
  transaction.update(gameRef, {
    history: firestore.FieldValue.arrayUnion(
      createEvent(`${playerData.displayName} trashed a scheme`)
    )
  })
  console.log(`trashed scheme with id ${props.id}!`)
})
export default trashScheme