import { createCloudFunction } from "../create/cloudFunction"
import guardPlayId from "../guard/playId"
import guardPlayDocs from "../guard/playDocs"

const playScheme = createCloudFunction(async (props, context, transaction) => {
  const { playerRef, playerData, profileRef } = await guardPlayDocs({
    gameId: props.gameId,
    transaction,
    context
  })
  guardPlayId({ hand: playerData.hand, id: props.id })
  console.log(`playing scheme with id ${props.id}...`)
  transaction.update(playerRef, {
    playId: props.id
  })
  transaction.update(profileRef, {
    playEmpty: false,
    ready: false
  })
  console.log(`played scheme with id ${props.id}!`)
})
export default playScheme