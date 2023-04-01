import { createCloudFunction } from "../createCloudFunction"
import guardPlayIndex from "../guard/playIndex"
import guardPlayDocs from "../guard/playDocs"
import guardDocData from "../guard/docData"
import { profilesRef } from "../db"
import { https } from "firebase-functions/v1"

const playReady = createCloudFunction(async (props, context, transaction) => {
  const { playerData, profileRef } = await guardPlayDocs({
    gameId: props.gameId,
    transaction,
    context
  })
  if (playerData.trashIndex == null) {
    throw new https.HttpsError(
      'failed-precondition',
      `This player has not trashed a scheme.`
    )
  }
  if (playerData.playIndex == null) {
    throw new https.HttpsError(
      'failed-precondition',
      `This player has not played a scheme.`
    )
  }
  console.log(`Setting ${context.auth?.uid} ready...`)
  transaction.update(profileRef, {
    ready: true
  })
  console.log(`${context.auth?.uid} is ready!`)
})
export default playReady