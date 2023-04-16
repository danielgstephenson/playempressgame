import { createCloudFunction } from '../create/cloudFunction'
import { createEvent } from '../create/event'
import { UnplaySchemeProps } from '../types'
import guardCurrentHand from '../guard/current/hand'
import { arrayUnion, deleteField } from 'firelord'
import updatePublicEvent from '../update/publicEvent'

const unplayScheme = createCloudFunction<UnplaySchemeProps>(async (props, context, transaction) => {
  console.info(`Unplaying scheme... ${props.schemeId}`)
  const {
    currentUid,
    currentGameData,
    currentPlayerRef,
    currentProfileRef,
    currentPlayerData,
    scheme: unplayScheme
  } = await guardCurrentHand({
    gameId: props.gameId,
    transaction,
    context,
    schemeId: props.schemeId,
    label: 'Play scheme'
  })
  transaction.update(currentPlayerRef, {
    playId: deleteField(),
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
    gameData: currentGameData,
    message: `${currentPlayerData.displayName} returned the their play scheme.`
  })
  console.info(`Unplayed scheme ${props.schemeId}!`)
})
export default unplayScheme
