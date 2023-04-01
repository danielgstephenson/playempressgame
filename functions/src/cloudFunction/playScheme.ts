import { createCloudFunction } from "../createCloudFunction"
import guardPlayIndex from "../guard/playIndex"
import guardPlayDocs from "../guard/playDocs"

const playScheme = createCloudFunction(async (props, context, transaction) => {
  const { playerRef, playerData, profileRef } = await guardPlayDocs({
    gameId: props.gameId,
    transaction,
    context
  })
  guardPlayIndex({ hand: playerData.hand, index: props.handIndex })
  console.log(`playing scheme at index ${props.schemeIndex}...`)
  transaction.update(playerRef, {
    playIndex: props.handIndex
  })
  transaction.update(profileRef, {
    playEmpty: false,
    ready: false
  })
  console.log(`played scheme at index ${props.schemeIndex}!`)
})
export default playScheme