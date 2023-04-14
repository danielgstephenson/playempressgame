import { createCloudFunction } from '../create/cloudFunction'
import { createEvent } from '../create/event'
import { UnplaySchemeProps } from '../types'
import guardCurrentHand from '../guard/current/hand'
import { arrayUnion, deleteField } from 'firelord'
import createEventUpdate from '../create/eventUpdate'
import updateOtherPlayers from '../updatePlayers'

const unplayScheme = createCloudFunction<UnplaySchemeProps>(async (props, context, transaction) => {
  console.log('Unplaying scheme...')
  const {
    currentUid,
    currentGameData,
    currentGameRef,
    currentPlayerRef,
    currentProfileRef,
    currentPlayerData,
    scheme: unplayScheme
  } = await guardCurrentHand({
    gameId: props.gameId,
    transaction,
    context,
    schemeId: props.schemeId,
    label: 'Play scheme'
  })
  transaction.update(currentPlayerRef, {
    playId: deleteField(),
    history: arrayUnion(
      createEvent(`You returned scheme ${unplayScheme.rank} from play.`)
    )
  })
  transaction.update(currentProfileRef, {
    playEmpty: true,
    ready: false
  })
  const displayNameUpdate = createEventUpdate(`${currentPlayerData.displayName} returned their scheme from play.`)
  transaction.update(currentGameRef, displayNameUpdate)
  updateOtherPlayers({
    currentUid,
    gameId: props.gameId,
    transaction,
    users: currentGameData.users,
    update: displayNameUpdate
  })
  console.log('Unplayed scheme!')
})
export default unplayScheme
