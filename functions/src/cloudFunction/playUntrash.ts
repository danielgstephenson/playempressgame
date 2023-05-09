import createCloudFunction from '../create/cloudFunction'
import createEvent from '../create/event'
import { arrayUnion, deleteField } from 'firelord'
import guardCurrentHand from '../guard/current/hand'
import { SchemeProps } from '../types'
import updateOtherPlayers from '../update/otherPlayers'

const playUntrash = createCloudFunction<SchemeProps>(async (props, context, transaction) => {
  console.info(`Untrashing scheme ${props.schemeId}...`)
  const {
    currentUid,
    currentGame,
    currentGameRef,
    currentPlayerRef,
    currentPlayer,
    scheme: untrashScheme
  } = await guardCurrentHand({
    gameId: props.gameId,
    transaction,
    context,
    schemeId: props.schemeId,
    label: 'Untrash scheme'
  })
  transaction.update(currentPlayerRef, {
    trashScheme: deleteField(),
    history: arrayUnion(
      createEvent(`You returned scheme ${untrashScheme.rank} from your trash.`)
    )
  })
  const publicEvent = createEvent(`${currentPlayer.displayName} returned a scheme from their trash.`)
  const publicUpdate = { history: arrayUnion(publicEvent) }
  const untrashedProfiles = currentGame.profiles.map(profile => {
    if (profile.userId === currentUid) {
      return {
        ...profile,
        trashEmpty: true,
        ready: false
      }
    }
    return profile
  })
  transaction.update(currentGameRef, {
    ...publicUpdate,
    profiles: untrashedProfiles
  })
  const userIds = currentGame.profiles.map(profile => profile.userId)
  updateOtherPlayers({
    currentUid,
    gameId: props.gameId,
    transaction,
    update: publicUpdate,
    userIds
  })
  console.info(`Untrashed scheme with id ${props.schemeId}!`)
})
export default playUntrash
