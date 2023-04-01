import { createCloudFunction } from "../createCloudFunction"
import { FieldValue } from "firebase-admin/firestore"
import guardPlayDocs from "../guard/playDocs"

const unplayScheme = createCloudFunction(async (props, context, transaction) => {
  console.log('props.gameId', props.gameId)
  const { playerRef, profileRef } = await guardPlayDocs({
    gameId: props.gameId,
    transaction,
    context
  })
  console.log('playerRef', playerRef)
  console.log(`unplaying scheme...`)
  transaction.update(playerRef, {
    playIndex: FieldValue.delete() 
  })
  transaction.update(profileRef, {
    playEmpty: true,
    ready: false
  })
  console.log('unplayed scheme!')
})
export default unplayScheme