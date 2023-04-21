import createCloudFunction from '../create/cloudFunction'
import createEvent from '../create/event'
import { arrayUnion, deleteField } from 'firelord'
import guardCurrentHand from '../guard/current/hand'
import updatePublicEvent from '../update/publicEvent'
import { SchemeProps } from '../types'

const playUntrash = createCloudFunction<SchemeProps>(async (props, context, transaction) => {
  console.info(`Untrashing scheme ${props.schemeId}...`)
  const {
    currentUid,
    currentGameData,
    currentPlayerRef,
    currentProfileRef,
    currentPlayerData,
    scheme: untrashScheme
  } = await guardCurrentHand({
    gameId: props.gameId,
    transaction,
    context,
    schemeId: props.schemeId,
    label: 'Untrash scheme'
  })
  transaction.update(currentPlayerRef, {
    trashId: deleteField(),
    history: arrayUnion(
      createEvent(`You returned scheme ${untrashScheme.rank} from your trash.`)
    )
  })
  transaction.update(currentProfileRef, {
    trashEmpty: true,
    ready: false
  })
  updatePublicEvent({
    currentUid,
    gameId: props.gameId,
    transaction,
    gameData: currentGameData,
    message: `${currentPlayerData.displayName} returned the their trash scheme.`
  })
  console.info(`Untrashed scheme with id ${props.schemeId}!`)
})
export default playUntrash
