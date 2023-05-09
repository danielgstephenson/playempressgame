import createCloudFunction from '../create/cloudFunction'
import createEvent from '../create/event'
import guardCurrentHand from '../guard/current/hand'
import { arrayUnion, deleteField } from 'firelord'
import { SchemeProps } from '../types'
import updateOtherPlayers from '../update/otherPlayers'

const playUnplay = createCloudFunction<SchemeProps>(async (props, context, transaction) => {
  console.info(`Unplaying scheme... ${props.schemeId}`)
  const {
    currentUid,
    currentGame,
    currentGameRef,
    currentPlayerRef,
    currentPlayer,
    scheme: unplayScheme
  } = await guardCurrentHand({
    gameId: props.gameId,
    transaction,
    context,
    schemeId: props.schemeId,
    label: 'Unplay scheme'
  })
  transaction.update(currentPlayerRef, {
    playScheme: deleteField(),
    history: arrayUnion(
      createEvent(`You returned scheme ${unplayScheme.rank} from play.`)
    )
  })
  const publicEvent = createEvent(`${currentPlayer.displayName} returned a scheme from play.`)
  const publicUpdate = { history: arrayUnion(publicEvent) }
  const unplayedProfiles = currentGame.profiles.map(profile => {
    if (profile.userId === currentUid) {
      return {
        ...profile,
        playEmpty: true,
        ready: false
      }
    }
    return profile
  })
  transaction.update(currentGameRef, {
    ...publicUpdate,
    profiles: unplayedProfiles
  })
  const userIds = currentGame.profiles.map(profile => profile.userId)
  updateOtherPlayers({
    currentUid,
    gameId: props.gameId,
    transaction,
    update: publicUpdate,
    userIds
  })
  console.info(`Unplayed scheme ${props.schemeId}!`)
})
export default playUnplay
