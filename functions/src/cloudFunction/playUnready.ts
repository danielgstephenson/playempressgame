import { createCloudFunction } from "../createCloudFunction"
import guardPlayDocs from "../guard/playDocs"
import { gamesRef } from "../db"
import { FieldValue } from "firebase-admin/firestore"

const playUnready = createCloudFunction(async (props, context, transaction) => {
  const { profileRef } = await guardPlayDocs({
    gameId: props.gameId,
    transaction,
    context
  })
  console.log(`Setting ${context.auth?.uid} unready...`)
  transaction.update(profileRef, {
    ready: false
  })
  const gameRef = gamesRef.doc(props.gameId)
  transaction.update(gameRef, {
    readyCount: FieldValue.increment(-1)
  })
  console.log(`${context.auth?.uid} is unready!`)
})
export default playUnready