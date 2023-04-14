import { createCloudFunction } from '../create/cloudFunction'
import guardPlayId from '../guard/playId'
import guardCurrentPlayer from '../guard/currentPlayer'
import { createEvent } from '../create/event'
import { TrashSchemeProps } from '../types'
import guardDefined from '../guard/defined'
import { arrayUnion } from 'firelord'
import createEventUpdate from '../create/eventUpdate'
import updateOtherPlayers from '../updatePlayers'

const trashScheme = createCloudFunction<TrashSchemeProps>(async (props, context, transaction) => {
  const { currentUid, gameData, gameRef, playerRef, playerData, profileRef } = await guardCurrentPlayer({
    gameId: props.gameId,
    transaction,
    context
  })
  console.log('playerData test:', playerData)
  console.log('props.schemeId test:', props.schemeId)
  guardPlayId({ hand: playerData.hand, id: props.schemeId })
  console.log(`trashing scheme with id ${props.schemeId}...`)
  const trashScheme = playerData.hand.find((scheme) => scheme.id === props.schemeId)
  const scheme = guardDefined(trashScheme, 'Trash Scheme')
  transaction.update(playerRef, {
    trashId: props.schemeId,
    history: arrayUnion(
      createEvent(`You are trashing scheme ${scheme.rank}`)
    )
  })
  transaction.update(profileRef, {
    trashEmpty: false,
    ready: false
  })
  const displayNameUpdate = createEventUpdate(`${playerData.displayName} is trashing a scheme`)
  transaction.update(gameRef, displayNameUpdate)
  updateOtherPlayers({
    currentUid,
    gameId: props.gameId,
    transaction,
    userIds: gameData.userIds,
    update: displayNameUpdate
  })
  console.log(`trashed scheme with id ${props.schemeId}!`)
})
export default trashScheme
