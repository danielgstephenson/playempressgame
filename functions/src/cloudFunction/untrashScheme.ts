import { createCloudFunction } from "../create/cloudFunction"
import guardPlayDocs from "../guard/playDocs"
import { FieldValue } from "firebase-admin/firestore"
import { createEvent } from "../create/event"
import { gamesRef } from "../db"

const untrashScheme = createCloudFunction(async (props, context, transaction) => {
  const { playerRef, profileRef, playerData } = await guardPlayDocs({
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
  transaction.update(gameRef, {
    history: FieldValue.arrayUnion(
      createEvent(`${playerData.displayName} returned the scheme from their trash.`)
    )
  })
  console.log('untrashed scheme!')
})
export default untrashScheme