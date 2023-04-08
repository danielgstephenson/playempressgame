import { createCloudFunction } from "../create/cloudFunction"
import guardPlayId from "../guard/playId"
import guardPlayDocs from "../guard/playDocs"
import { firestore } from "firebase-admin"
import { createEvent } from "../create/event"
import { gamesRef } from "../db"

const playScheme = createCloudFunction(async (props, context, transaction) => {
  const { playerRef, playerData, profileRef } = await guardPlayDocs({
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
      createEvent(`You played scheme ${playScheme.rank}`)
    )
  })
  transaction.update(profileRef, {
    playEmpty: false,
    ready: false
  })
  transaction.update(gameRef, {
    history: firestore.FieldValue.arrayUnion(
      createEvent(`${playerData.displayName} played a scheme`)
    )
  })
  console.log(`played scheme with id ${props.id}!`)
})
export default playScheme