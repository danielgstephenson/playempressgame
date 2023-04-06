import { createCloudFunction } from "../create/cloudFunction"
import guardPlayDocs from "../guard/playDocs"
import { FieldValue } from "firebase-admin/firestore"

const untrashScheme = createCloudFunction(async (props, context, transaction) => {
  const { playerRef, profileRef } = await guardPlayDocs({
    gameId: props.gameId,
    transaction,
    context
  })
  console.log(`untrashing scheme...`)
  transaction.update(playerRef, {
    trashId: FieldValue.delete()
  })
  transaction.update(profileRef, {
    trashEmpty: true,
    ready: false
  })
  console.log('untrashed scheme!')
})
export default untrashScheme