import { createCloudFunction } from '../create/cloudFunction'
import guardCurrentPlayer from '../guard/current/player'
import { createEvent } from '../create/event'
import { PlayUnreadyProps } from '../types'
import { arrayUnion, increment } from 'firelord'
import createEventUpdate from '../create/eventUpdate'
import updateOtherPlayers from '../update/players'

const playUnready = createCloudFunction<PlayUnreadyProps>(async (props, context, transaction) => {
  const {
    currentUid,
    currentGameData,
    currentGameRef,
    currentPlayerId,
    currentProfileRef,
    currentPlayerRef,
    currentPlayerData
  } = await guardCurrentPlayer({
    gameId: props.gameId,
    transaction,
    context
  })
  console.log(`Setting ${currentPlayerId} unready...`)
  transaction.update(currentProfileRef, {
    ready: false
  })
  const displayNameUpdate = createEventUpdate(`${currentPlayerData.displayName} is not ready`)
  transaction.update(currentGameRef, {
    readyCount: increment(-1),
    ...displayNameUpdate
  })
  updateOtherPlayers({
    currentUid,
    gameId: props.gameId,
    transaction,
    users: currentGameData.users,
    update: displayNameUpdate
  })
  transaction.update(currentPlayerRef, {
    history: arrayUnion(
      createEvent('You are not ready')
    )
  })
  console.log(`${currentPlayerId} is unready!`)
})
export default playUnready
