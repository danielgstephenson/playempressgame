import { createCloudFunction } from '../create/cloudFunction'
import { createEvent } from '../create/event'
import { UntrashSchemeProps } from '../types'
import { arrayUnion, deleteField } from 'firelord'
import createEventUpdate from '../create/eventUpdate'
import updateOtherPlayers from '../updatePlayers'
import guardCurrentHand from '../guard/current/hand'

const untrashScheme = createCloudFunction<UntrashSchemeProps>(async (props, context, transaction) => {
  console.log(`Untrashing scheme ${props.schemeId}...`)
  const {
    currentUid,
    currentGameData,
    currentGameRef,
    currentPlayerRef,
    currentProfileRef,
    currentPlayerData,
    scheme: untrashScheme
  } = await guardCurrentHand({
    gameId: props.gameId,
    transaction,
    context,
    schemeId: props.schemeId,
    label: 'Untrash scheme'
  })
  transaction.update(currentPlayerRef, {
    trashId: deleteField(),
    history: arrayUnion(
      createEvent(`You returned scheme ${untrashScheme.rank} from your trash`)
    )
  })
  transaction.update(currentProfileRef, {
    trashEmpty: true,
    ready: false
  })
  const displayNameUpdate = createEventUpdate(`${currentPlayerData.displayName} returned the scheme from their trash.`)
  transaction.update(currentGameRef, displayNameUpdate)
  updateOtherPlayers({
    currentUid,
    gameId: props.gameId,
    transaction,
    users: currentGameData.users,
    update: displayNameUpdate
  })
  console.log(`Untrashed scheme with id ${props.schemeId}!`)
})
export default untrashScheme
