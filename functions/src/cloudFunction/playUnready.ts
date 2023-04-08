import { createCloudFunction } from "../create/cloudFunction"
import guardPlayDocs from "../guard/playDocs"
import { gamesRef } from "../db"
import { FieldValue } from "firebase-admin/firestore"
import { createEvent } from "../create/event"

const playUnready = createCloudFunction(async (props, context, transaction) => {
  const { playerId, profileRef, playerRef, playerData } = await guardPlayDocs({
    gameId: props.gameId,
    transaction,
    context
  })
  console.log(`Setting ${playerId} unready...`)
  transaction.update(profileRef, {
    ready: false
  })
  const gameRef = gamesRef.doc(props.gameId)
  transaction.update(gameRef, {
    readyCount: FieldValue.increment(-1),
    history: FieldValue.arrayUnion(
      createEvent(`${playerData.displayName} is not ready`)
    )
  })
  transaction.update(playerRef, {
    history: FieldValue.arrayUnion(
      createEvent(`You are not ready`)
    )
  })
  console.log(`${playerId} is unready!`)
})
export default playUnready