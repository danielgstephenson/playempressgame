import createCloudFunction from '../create/cloudFunction'
import guardCurrentHand from '../guard/current/hand'
import createEvent from '../create/event'
import { arrayUnion } from 'firelord'
import { SchemeProps } from '../types'
import { https } from 'firebase-functions/v1'
import updateOtherPlayers from '../update/otherPlayers'

const playPlay = createCloudFunction<SchemeProps>(async (props, context, transaction) => {
  console.info(`Playing scheme ${props.schemeId}...`)
  const {
    currentGame,
    currentGameRef,
    currentUid,
    currentPlayer,
    currentPlayerRef,
    scheme: playScheme,
    schemeRef
  } = await guardCurrentHand({
    gameId: props.gameId,
    transaction,
    context,
    schemeId: props.schemeId,
    label: 'playPlay Scheme'
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
  const publicEvent = createEvent(`${currentPlayer.displayName} is playing a scheme.`)
  const publicUpdate = { history: arrayUnion(publicEvent) }
  const playedProfiles = currentGame.profiles.map(profile => {
    if (profile.userId === currentUid) {
      return {
        ...profile,
        playAreaEmpty: false,
        ready: false
      }
    }
    return profile
  })
  transaction.update(currentGameRef, {
    ...publicUpdate,
    profiles: playedProfiles
  })
  updateOtherPlayers({
    currentUid,
    gameId: props.gameId,
    transaction,
    update: publicUpdate,
    userIds: currentGame.profiles.map(profile => profile.userId)
  })
  console.info(`Played scheme ${props.schemeId}!`)
})
export default playPlay
