import createCloudFunction from '../create/cloudFunction'
import createEvent from '../create/event'
import guardCurrentHand from '../guard/current/hand'
import { arrayUnion, deleteField } from 'firelord'
import updatePublicEvent from '../update/publicEvent'
import { SchemeProps } from '../types'

const playUnplay = createCloudFunction<SchemeProps>(async (props, context, transaction) => {
  console.info(`Unplaying scheme... ${props.schemeId}`)
  const {
    currentUid,
    currentGame,
    currentPlayerRef,
    currentProfileRef,
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
  transaction.update(currentProfileRef, {
    playEmpty: true,
    ready: false
  })
  updatePublicEvent({
    currentUid,
    gameId: props.gameId,
    transaction,
    gameData: currentGame,
    message: `${currentPlayer.displayName} returned the their play scheme.`
  })
  console.info(`Unplayed scheme ${props.schemeId}!`)
})
export default playUnplay
