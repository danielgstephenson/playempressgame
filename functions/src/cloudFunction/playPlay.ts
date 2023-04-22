import createCloudFunction from '../create/cloudFunction'
import guardCurrentHand from '../guard/current/hand'
import createEvent from '../create/event'
import { arrayUnion } from 'firelord'
import updatePublicEvent from '../update/publicEvent'
import { SchemeProps } from '../types'
import { https } from 'firebase-functions/v1'

const playPlay = createCloudFunction<SchemeProps>(async (props, context, transaction) => {
  console.info(`Playing scheme ${props.schemeId}...`)
  const {
    currentGame,
    currentUid,
    currentPlayer,
    currentPlayerRef,
    currentProfileRef,
    scheme: playScheme,
    schemeRef
  } = await guardCurrentHand({
    gameId: props.gameId,
    transaction,
    context,
    schemeId: props.schemeId,
    label: 'Play Scheme'
  })
  if (currentPlayer.trashScheme?.id === props.schemeId) {
    throw new https.HttpsError(
      'invalid-argument',
      'You cannot play a scheme in your trash.'
    )
  }
  transaction.update(currentPlayerRef, {
    playScheme: schemeRef,
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
    gameData: currentGame,
    message: `${currentPlayer.displayName} is playing a scheme.`
  })
  console.info(`Played scheme ${props.schemeId}!`)
})
export default playPlay
