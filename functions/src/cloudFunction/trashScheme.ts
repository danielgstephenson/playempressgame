import { createCloudFunction } from "../createCloudFunction"
import guardPlayIndex from "../guard/playIndex"
import guardPlayDocs from "../guard/playDocs"

const trashScheme = createCloudFunction(async (props, context, transaction) => {
  const { playerRef, playerData, profileRef } = await guardPlayDocs({
    gameId: props.gameId,
    transaction,
    context
  })
  guardPlayIndex({ hand: playerData.hand, index: props.handIndex })
  console.log(`trashing scheme at index ${props.schemeIndex}...`)
  transaction.update(playerRef, {
    trashIndex: props.handIndex
  })
  transaction.update(profileRef, {
    trashEmpty: false,
    ready: false
  })
  console.log(`trashed scheme at index ${props.schemeIndex}!`)
})
export default trashScheme