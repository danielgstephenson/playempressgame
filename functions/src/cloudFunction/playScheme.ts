import { createCloudFunction } from '../create/cloudFunction'
import guardPlayId from '../guard/playId'
import guardCurrentPlayer from '../guard/currentPlayer'
import { createEvent } from '../create/event'
import { gamesLord } from '../db'
import { PlaySchemeProps } from '../types'
import guardDefined from '../guard/defined'
import { arrayUnion } from 'firelord'
import updateOtherPlayers from '../updatePlayers'
import createEventUpdate from '../create/eventUpdate'

const playScheme = createCloudFunction<PlaySchemeProps>(async (props, context, transaction) => {
  const { gameData, currentUid, playerRef, playerData, profileRef } = await guardCurrentPlayer({
    gameId: props.gameId,
    transaction,
    context
  })
  guardPlayId({ hand: playerData.hand, id: props.schemeId })
  console.log(`playing scheme with id ${props.schemeId}...`)
  const gameRef = gamesLord.doc(props.gameId)
  const scheme = playerData.hand.find((scheme: any) => scheme.id === props.schemeId)
  const playScheme = guardDefined(scheme, 'Play Scheme')
  transaction.update(playerRef, {
    playId: props.schemeId,
    history: arrayUnion(
      createEvent(`You are playing scheme ${playScheme.rank}`)
    )
  })
  transaction.update(profileRef, {
    playEmpty: false,
    ready: false
  })
  const displayNameUpdate = createEventUpdate(`${playerData.displayName} is playing a scheme`)
  transaction.update(gameRef, displayNameUpdate)
  updateOtherPlayers({
    currentUid,
    gameId: props.gameId,
    transaction,
    userIds: gameData.userIds,
    update: displayNameUpdate
  })
  console.log(`played scheme with id ${props.schemeId}!`)
})
export default playScheme
