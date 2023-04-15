import { createCloudFunction } from '../create/cloudFunction'
import guardCurrentHand from '../guard/current/hand'
import { createEvent } from '../create/event'
import { PlaySchemeProps } from '../types'
import { arrayUnion } from 'firelord'
import updatePublicEvent from '../update/publicEvent'

const playScheme = createCloudFunction<PlaySchemeProps>(async (props, context, transaction) => {
  console.log(`playing scheme with id ${props.schemeId}...`)
  const {
    currentGameData,
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
  updatePublicEvent({
    currentUid,
    gameId: props.gameId,
    transaction,
    gameData: currentGameData,
    message: `${currentPlayerData.displayName} is playing a scheme.`
  })
})
export default playScheme
