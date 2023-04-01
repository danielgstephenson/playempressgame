import { createCloudFunction } from "../createCloudFunction"
import guardPlayIndex from "../guard/playIndex"
import guardPlayDocs from "../guard/playDocs"
import guardDocData from "../guard/docData"
import { profilesRef } from "../db"
import { https } from "firebase-functions/v1"

const playUnready = createCloudFunction(async (props, context, transaction) => {
  const { playerData, profileRef } = await guardPlayDocs({
    gameId: props.gameId,
    transaction,
    context
  })
  console.log(`Setting ${context.auth?.uid} unready...`)
  transaction.update(profileRef, {
    ready: false
  })
  console.log(`${context.auth?.uid} is unready!`)
})
export default playUnready