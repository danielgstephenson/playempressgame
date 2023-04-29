import createCloudFunction from '../create/cloudFunction'
import createEvent from '../create/event'
import { Profile, SchemeProps, Write } from '../types'
import guardChoice from '../guard/choice'
import implementChoice from '../implementChoice'

const deckChoose = createCloudFunction<SchemeProps>(async (props, context, transaction) => {
  console.info(`Choosing scheme ${props.schemeId} to put on deck...`)
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
    label: 'Deck choice scheme'
  })
  const privateChoiceEvent = createEvent(`You chose scheme ${schemeRef.rank} to put face down on your deck.`)
  const chosenPlayerEvents = [privateChoiceEvent]
  const publicChoiceEvent = createEvent(`${currentPlayer.displayName} chose a scheme to put face down on their deck.`)
  const publicEvents = [publicChoiceEvent]
  const chosenPlayer = {
    ...currentPlayer,
    hand: currentPlayer.hand.filter(scheme => {
      return scheme.id !== props.schemeId
    }),
    deck: [...currentPlayer.deck, schemeRef]
  }
  const chosenProfileChanges: Write<Profile> = {
    deckEmpty: chosenPlayer.deck.length === 0
  }
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
  console.info(`Chose scheme with id ${props.schemeId} to put on deck!`)
})
export default deckChoose
