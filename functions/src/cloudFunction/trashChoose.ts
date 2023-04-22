import createCloudFunction from '../create/cloudFunction'
import createEvent from '../create/event'
import { SchemeProps } from '../types'
import { arrayRemove, arrayUnion } from 'firelord'
import createEventUpdate from '../create/eventUpdate'
import updateOtherPlayers from '../update/otherPlayers'
import guardChoice from '../guard/choice'

const deckChoose = createCloudFunction<SchemeProps>(async (props, context, transaction) => {
  console.info(`Choosing scheme ${props.schemeId} to trash...`)
  const {
    choice,
    currentUid,
    currentGameData,
    currentGameRef,
    currentPlayerRef,
    currentPlayerData,
    schemeRef
  } = await guardChoice({
    gameId: props.gameId,
    transaction,
    context,
    schemeId: props.schemeId,
    label: 'Trash choice scheme'
  })
  transaction.update(currentPlayerRef, {
    hand: arrayRemove(schemeRef),
    deck: arrayUnion(schemeRef),
    history: arrayUnion(
      createEvent(`You put scheme ${schemeRef.rank} face down on your deck.`)
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
