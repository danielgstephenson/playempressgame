import { createCloudFunction } from '../create/cloudFunction'
import { createEvent } from '../create/event'
import { TrashSchemeProps } from '../types'
import { arrayUnion } from 'firelord'
import updatePublicEvent from '../update/publicEvent'
import guardCurrentHand from '../guard/current/hand'

const trashScheme = createCloudFunction<TrashSchemeProps>(async (props, context, transaction) => {
  console.log(`Trashing scheme ${props.schemeId}...`)
  const {
    currentGameData,
    currentUid,
    currentPlayerRef,
    currentPlayerData,
    currentProfileRef,
    scheme: trashScheme
  } = await guardCurrentHand({
    gameId: props.gameId,
    transaction,
    context,
    schemeId: props.schemeId,
    label: 'Play scheme'
  })
  transaction.update(currentPlayerRef, {
    trashId: props.schemeId,
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
    gameData: currentGameData,
    message: `${currentPlayerData.displayName} is trashing a scheme.`
  })
  console.log(`Trashed scheme with id ${props.schemeId}!`)
})
export default trashScheme
