import { createCloudFunction } from '../create/cloudFunction'
import guardCurrentPlayer from '../guard/currentPlayer'
import { createEvent } from '../create/event'
import { UnplaySchemeProps } from '../types'
import guardHandScheme from '../guard/handScheme'
import { arrayUnion, deleteField } from 'firelord'
import createEventUpdate from '../create/eventUpdate'
import updateOtherPlayers from '../updatePlayers'

const unplayScheme = createCloudFunction<UnplaySchemeProps>(async (props, context, transaction) => {
  console.log('props.gameId', props.gameId)
  const { currentUid, gameData, gameRef, playerRef, profileRef, playerData } = await guardCurrentPlayer({
    gameId: props.gameId,
    transaction,
    context
  })
  console.log('playerRef', playerRef)
  console.log('unplaying scheme...')
  const unplayScheme = guardHandScheme({ hand: playerData.hand, schemeId: props.schemeId, label: 'unplay scheme' })
  transaction.update(playerRef, {
    playId: deleteField(),
    history: arrayUnion(
      createEvent(`You returned scheme ${unplayScheme.rank} from play`)
    )
  })
  transaction.update(profileRef, {
    playEmpty: true,
    ready: false
  })
  const displayNameUpdate = createEventUpdate(`${playerData.displayName} returned their scheme from play.`)
  transaction.update(gameRef, displayNameUpdate)
  updateOtherPlayers({
    currentUid,
    gameId: props.gameId,
    transaction,
    userIds: gameData.userIds,
    update: displayNameUpdate
  })
  console.log('unplayed scheme!')
})
export default unplayScheme
