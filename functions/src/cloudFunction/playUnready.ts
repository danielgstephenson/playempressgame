import createCloudFunction from '../create/cloudFunction'
import guardCurrentPlaying from '../guard/current/player'
import createEvent from '../create/event'
import { arrayUnion, increment } from 'firelord'
import createEventUpdate from '../create/eventUpdate'
import updateOtherPlayers from '../update/otherPlayers'
import { SchemeProps } from '../types'

const playUnready = createCloudFunction<SchemeProps>(async (props, context, transaction) => {
  const {
    currentUid,
    currentGame,
    currentGameRef,
    currentPlayerId,
    currentProfileRef,
    currentPlayerRef,
    currentPlayer
  } = await guardCurrentPlaying({
    gameId: props.gameId,
    transaction,
    context
  })
  console.info(`Setting ${currentPlayerId} unready...`)
  transaction.update(currentProfileRef, {
    ready: false
  })
  const displayNameUpdate = createEventUpdate(`${currentPlayer.displayName} is not ready`)
  transaction.update(currentGameRef, {
    readyCount: increment(-1),
    ...displayNameUpdate
  })
  updateOtherPlayers({
    currentUid,
    gameId: props.gameId,
    transaction,
    users: currentGame.users,
    update: displayNameUpdate
  })
  transaction.update(currentPlayerRef, {
    history: arrayUnion(
      createEvent('You are not ready')
    )
  })
  console.info(`${currentPlayerId} is unready!`)
})
export default playUnready
