import { createCloudFunction } from "../create/cloudFunction"
import guardPlayId from "../guard/playId"
import guardPlayDocs from "../guard/playDocs"

const trashScheme = createCloudFunction(async (props, context, transaction) => {
  const { playerRef, playerData, profileRef } = await guardPlayDocs({
    gameId: props.gameId,
    transaction,
    context
  })
  guardPlayId({ hand: playerData.hand, id: props.id })
  console.log(`trashing scheme with id ${props.id}...`)
  transaction.update(playerRef, {
    trashId: props.id
  })
  transaction.update(profileRef, {
    trashEmpty: false,
    ready: false
  })
  console.log(`trashed scheme with id ${props.id}!`)
})
export default trashScheme