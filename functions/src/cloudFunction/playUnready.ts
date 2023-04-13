import { createCloudFunction } from "../create/cloudFunction"
import guardPlayerData from "../guard/playerData"
import { gamesLord } from "../db"
import { createEvent } from "../create/event"
import { PlayUnreadyProps } from "../types"
import { arrayUnion, increment } from "firelord"

const playUnready = createCloudFunction<PlayUnreadyProps>(async (props, context, transaction) => {
  const { playerId, profileRef, playerRef, playerData } = await guardPlayerData({
    gameId: props.gameId,
    transaction,
    context
  })
  console.log(`Setting ${playerId} unready...`)
  transaction.update(profileRef, {
    ready: false
  })
  const gameRef = gamesLord.doc(props.gameId)
  transaction.update(gameRef, {
    readyCount: increment(-1),
    history: arrayUnion(
      createEvent(`${playerData.displayName} is not ready`)
    )
  })
  transaction.update(playerRef, {
    history: arrayUnion(
      createEvent(`You are not ready`)
    )
  })
  console.log(`${playerId} is unready!`)
})
export default playUnready