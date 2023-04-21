import createCloudFunction from '../create/cloudFunction'
import createEvent from '../create/event'
import { SchemeProps } from '../types'
import { arrayRemove, arrayUnion } from 'firelord'
import guardCurrentHand from '../guard/current/hand'
import createEventUpdate from '../create/eventUpdate'
import updateOtherPlayers from '../update/otherPlayers'
import { https } from 'firebase-functions/v1'
import serializeScheme from '../serialize/scheme'

const deckChoose = createCloudFunction<SchemeProps>(async (props, context, transaction) => {
  console.info(`Choosing scheme ${props.schemeId} to put on deck...`)
  const {
    currentUid,
    currentPlayerId,
    currentGameData,
    currentGameRef,
    currentPlayerRef,
    currentPlayerData,
    scheme
  } = await guardCurrentHand({
    gameId: props.gameId,
    transaction,
    context,
    schemeId: props.schemeId,
    label: 'Deck choice scheme'
  })
  const chosenScheme = serializeScheme(scheme)
  const choice = currentGameData.choices.find(choice => choice.playerId === currentPlayerId)
  console.log('choice test:', choice)
  if (choice == null) {
    throw new https.HttpsError(
      'failed-precondition',
      'You are not choosing a scheme to put on your deck.'
    )
  }
  console.log('chosenScheme', chosenScheme)
  transaction.update(currentPlayerRef, {
    hand: arrayRemove(chosenScheme),
    deck: arrayUnion(chosenScheme),
    history: arrayUnion(
      createEvent(`You put scheme ${chosenScheme.rank} face down on your deck.`)
    )
  })
  const update = createEventUpdate(`${currentPlayerData.displayName} put a scheme face down on their deck.`)
  transaction.update(currentGameRef, {
    ...update,
    choices: arrayRemove(choice)
  })
  updateOtherPlayers({
    currentUid,
    gameId: props.gameId,
    transaction,
    users: currentGameData.users,
    update
  })
  console.info(`Chose scheme with id ${props.schemeId} to put on deck!`)
})
export default deckChoose
