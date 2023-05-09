import createCloudFunction from '../create/cloudFunction'
import createEvent from '../create/event'
import { arrayUnion } from 'firelord'
import guardCurrentHand from '../guard/current/hand'
import { SchemeProps } from '../types'
import { https } from 'firebase-functions/v1'
import updateOtherPlayers from '../update/otherPlayers'

const playTrash = createCloudFunction<SchemeProps>(async (props, context, transaction) => {
  console.info(`Trashing scheme ${props.schemeId}...`)
  const {
    currentGame,
    currentGameRef,
    currentUid,
    currentPlayerRef,
    currentPlayer,
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
  const trashedProfiles = currentGame.profiles.map(profile => {
    if (profile.userId === currentUid) {
      return {
        ...profile,
        trashAreaEmpty: false,
        ready: false
      }
    }
    return profile
  })
  const publicEvent = createEvent(`${currentPlayer.displayName} is trashing a scheme.`)
  const publicUpdate = {
    history: arrayUnion(publicEvent)
  }
  transaction.update(currentGameRef, {
    ...publicUpdate,
    profiles: trashedProfiles
  })
  updateOtherPlayers({
    currentUid,
    gameId: props.gameId,
    transaction,
    update: publicUpdate,
    userIds: currentGame.profiles.map(profile => profile.userId)
  })
  console.info(`Trashed scheme with id ${props.schemeId}!`)
})
export default playTrash
