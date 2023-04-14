import { createCloudFunction } from '../create/cloudFunction'
import guardCurrentPlayer from '../guard/currentPlayer'
import { createEvent } from '../create/event'
import { PlayUnreadyProps } from '../types'
import { arrayUnion, increment } from 'firelord'
import createEventUpdate from '../create/eventUpdate'
import updateOtherPlayers from '../updatePlayers'

const playUnready = createCloudFunction<PlayUnreadyProps>(async (props, context, transaction) => {
  const { currentUid, gameData, gameRef, playerId, profileRef, playerRef, playerData } = await guardCurrentPlayer({
    gameId: props.gameId,
    transaction,
    context
  })
  console.log(`Setting ${playerId} unready...`)
  transaction.update(profileRef, {
    ready: false
  })
  const displayNameUpdate = createEventUpdate(`${playerData.displayName} is not ready`)
  transaction.update(gameRef, {
    readyCount: increment(-1),
    ...displayNameUpdate
  })
  updateOtherPlayers({
    currentUid,
    gameId:
    props.gameId,
    transaction,
    userIds: gameData.userIds,
    update: displayNameUpdate
  })
  transaction.update(playerRef, {
    history: arrayUnion(
      createEvent('You are not ready')
    )
  })
  console.log(`${playerId} is unready!`)
})
export default playUnready
