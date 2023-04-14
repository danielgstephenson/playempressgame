import { createCloudFunction } from '../create/cloudFunction'
import guardCurrentHand from '../guard/current/hand'
import { createEvent } from '../create/event'
import { PlaySchemeProps } from '../types'
import { arrayUnion } from 'firelord'
import updateOtherPlayers from '../updatePlayers'
import createEventUpdate from '../create/eventUpdate'

const playScheme = createCloudFunction<PlaySchemeProps>(async (props, context, transaction) => {
  console.log(`playing scheme with id ${props.schemeId}...`)
  const {
    currentGameData,
    currentGameRef,
    currentUid,
    currentPlayerRef,
    currentPlayerData,
    currentProfileRef,
    scheme: playScheme
  } = await guardCurrentHand({
    gameId: props.gameId,
    transaction,
    context,
    schemeId: props.schemeId,
    label: 'Play Scheme'
  })
  transaction.update(currentPlayerRef, {
    playId: props.schemeId,
    history: arrayUnion(
      createEvent(`You are playing scheme ${playScheme.rank}`)
    )
  })
  transaction.update(currentProfileRef, {
    playEmpty: false,
    ready: false
  })
  const displayNameUpdate = createEventUpdate(`${currentPlayerData.displayName} is playing a scheme`)
  transaction.update(currentGameRef, displayNameUpdate)
  updateOtherPlayers({
    currentUid,
    gameId: props.gameId,
    transaction,
    users: currentGameData.users,
    update: displayNameUpdate
  })
  console.log(`played scheme with id ${props.schemeId}!`)
})
export default playScheme
