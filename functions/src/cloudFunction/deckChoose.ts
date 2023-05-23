import createCloudFunction from '../create/cloudFunction'
import createEvent from '../create/event'
import { SchemeProps } from '../types'
import guardChoice from '../guard/choice'
import getOtherPlayers from '../get/otherPlayers'
import onChoiceComplete from '../onChoiceComplete'

const deckChoose = createCloudFunction<SchemeProps>(async (props, context, transaction) => {
  console.info(`Choosing scheme ${props.schemeId} to put on deck...`)
  const {
    choice,
    currentUid,
    currentGame,
    currentPlayer,
    scheme
  } = await guardChoice({
    gameId: props.gameId,
    transaction,
    context,
    schemeId: props.schemeId,
    label: 'Deck choice scheme'
  })
  const otherPlayers = await getOtherPlayers({
    currentUid,
    gameId: currentGame.id,
    transaction
  })
  const players = [currentPlayer, ...otherPlayers]
  const playState = {
    game: currentGame,
    players
  }
  currentPlayer.hand = currentPlayer.hand.filter(scheme => {
    return scheme.id !== props.schemeId
  })
  currentPlayer.deck = [...currentPlayer.deck, scheme]
  const privateChoiceEvent = createEvent(`You chose scheme ${scheme.rank} to put face down on your deck.`)
  currentPlayer.history.push(privateChoiceEvent)
  const publicChoiceEvent = createEvent(`${currentPlayer.displayName} chose a scheme to put face down on their deck.`)
  playState.game.history.push(publicChoiceEvent)
  otherPlayers.forEach(otherPlayer => otherPlayer.history.push(publicChoiceEvent))
  onChoiceComplete({
    choice,
    currentPlayer,
    playState,
    transaction
  })
  console.info(`Chose scheme with id ${props.schemeId} to put on deck!`)
})
export default deckChoose
