import createCloudFunction from '../create/cloudFunction'
import createEvent from '../create/event'
import { arrayUnion } from 'firelord'
import updatePublicEvent from '../update/publicEvent'
import guardCurrentHand from '../guard/current/hand'
import { SchemeProps } from '../types'
import { https } from 'firebase-functions/v1'

const playTrash = createCloudFunction<SchemeProps>(async (props, context, transaction) => {
  console.info(`Trashing scheme ${props.schemeId}...`)
  const {
    currentGame,
    currentUid,
    currentPlayerRef,
    currentPlayer,
    currentProfileRef,
    scheme: trashScheme,
    schemeRef
  } = await guardCurrentHand({
    gameId: props.gameId,
    transaction,
    context,
    schemeId: props.schemeId,
    label: 'Trash scheme'
  })
  if (currentPlayer.playScheme?.id === props.schemeId) {
    throw new https.HttpsError(
      'invalid-argument',
      'You cannot trash a scheme that is in play.'
    )
  }
  transaction.update(currentPlayerRef, {
    trashScheme: schemeRef,
    history: arrayUnion(
      createEvent(`You are trashing scheme ${trashScheme.rank}.`)
    )
  })
  transaction.update(currentProfileRef, {
    trashEmpty: false,
    ready: false
  })
  updatePublicEvent({
    currentUid,
    gameId: props.gameId,
    transaction,
    gameData: currentGame,
    message: `${currentPlayer.displayName} is trashing a scheme.`
  })
  console.info(`Trashed scheme with id ${props.schemeId}!`)
})
export default playTrash
