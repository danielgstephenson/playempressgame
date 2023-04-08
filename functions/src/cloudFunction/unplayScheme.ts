import { createCloudFunction } from "../create/cloudFunction"
import { FieldValue } from "firebase-admin/firestore"
import guardPlayDocs from "../guard/playDocs"
import { createEvent } from "../create/event"
import { gamesRef } from "../db"

const unplayScheme = createCloudFunction(async (props, context, transaction) => {
  console.log('props.gameId', props.gameId)
  const { playerRef, profileRef, playerData } = await guardPlayDocs({
    gameId: props.gameId,
    transaction,
    context
  })
  console.log('playerRef', playerRef)
  console.log(`unplaying scheme...`)
  const unplayScheme = playerData.hand.find( (scheme: any) => scheme.id === props.schemeId)
  transaction.update(playerRef, {
    playId: FieldValue.delete(),
    history: FieldValue.arrayUnion(
      createEvent(`You returned scheme ${unplayScheme.rank} from play`)
    )
  })
  transaction.update(profileRef, {
    playEmpty: true,
    ready: false
  })
  const gameRef = gamesRef.doc(props.gameId)
  transaction.update(gameRef, {
    history: FieldValue.arrayUnion(
      createEvent(`${playerData.displayName} returned their scheme from play.`)
    )
  })
  console.log('unplayed scheme!')
})
export default unplayScheme