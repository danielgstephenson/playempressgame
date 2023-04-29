import createCloudFunction from '../create/cloudFunction'
import createEvent from '../create/event'
import { Profile, SchemeProps, Write } from '../types'
import guardChoice from '../guard/choice'
import implementChoice from '../implementChoice'

const trashChoose = createCloudFunction<SchemeProps>(async (props, context, transaction) => {
  console.info(`Choosing scheme ${props.schemeId} to trash...`)
  const {
    choice,
    currentUid,
    currentGame,
    currentGameRef,
    currentPlayer,
    currentPlayerRef,
    currentProfileRef,
    schemeRef
  } = await guardChoice({
    gameId: props.gameId,
    transaction,
    context,
    schemeId: props.schemeId,
    label: 'Trash choice scheme'
  })
  const privateChoiceEvent = createEvent(`You chose scheme ${schemeRef.rank} to trash from your hand.`)
  const chosenPlayerEvents = [privateChoiceEvent]
  const publicChoiceEvent = createEvent(`${currentPlayer.displayName} chose a a scheme to trash from their hand.`)
  const publicEvents = [publicChoiceEvent]
  const chosenPlayer = {
    ...currentPlayer,
    hand: currentPlayer.hand.filter(scheme => {
      return scheme.id !== props.schemeId
    })
  }
  const chosenProfileChanges: Write<Profile> = {}
  await implementChoice({
    chosenPlayer,
    gameId: props.gameId,
    currentGame,
    transaction,
    currentPlayer,
    choice,
    chosenPlayerEvents,
    currentPlayerRef,
    currentProfileRef,
    chosenProfileChanges,
    currentUid,
    publicEvents,
    currentGameRef
  })
  console.info(`Chose scheme with id ${props.schemeId} to trash!`)
})
export default trashChoose
