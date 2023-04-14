import { createCloudFunction } from '../create/cloudFunction'
import guardCurrentPlayer from '../guard/currentPlayer'
import { createEvent } from '../create/event'
import { UntrashSchemeProps } from '../types'
import { arrayUnion, deleteField } from 'firelord'
import guardDefined from '../guard/defined'
import createEventUpdate from '../create/eventUpdate'
import updateOtherPlayers from '../updatePlayers'

const untrashScheme = createCloudFunction<UntrashSchemeProps>(async (props, context, transaction) => {
  console.log('untrashing scheme...')
  const { currentUid, gameData, gameRef, playerRef, profileRef, playerData } = await guardCurrentPlayer({
    gameId: props.gameId,
    transaction,
    context
  })
  const scheme = playerData.hand.find((scheme: any) => scheme.id === props.schemeId)
  const untrashScheme = guardDefined(scheme, 'Untrash Scheme')
  transaction.update(playerRef, {
    trashId: deleteField(),
    history: arrayUnion(
      createEvent(`You returned scheme ${untrashScheme.rank} from your trash`)
    )
  })
  transaction.update(profileRef, {
    trashEmpty: true,
    ready: false
  })
  const displayNameUpdate = createEventUpdate(`${playerData.displayName} returned the scheme from their trash.`)
  transaction.update(gameRef, displayNameUpdate)
  updateOtherPlayers({
    currentUid,
    gameId: props.gameId,
    transaction,
    userIds: gameData.userIds,
    update: displayNameUpdate
  })
  console.log('untrashed scheme!')
})
export default untrashScheme
