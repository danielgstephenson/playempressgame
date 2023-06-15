import addPublicEvents from '../add/events/public'
import createCloudFunction from '../create/cloudFunction'
import { SchemeProps } from '../types'
import guardChoice from '../guard/choice'
import getOtherPlayers from '../get/otherPlayers'
import onChoiceComplete from '../onChoiceComplete'
import addEvent from '../add/event'
import joinRanks from '../join/ranks'

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
  const before = joinRanks(currentPlayer.deck)
  currentPlayer.deck = [scheme, ...currentPlayer.deck]
  const after = joinRanks(currentPlayer.deck)
  const privateChoiceEvent = addEvent(currentPlayer, `You chose scheme ${scheme.rank} to put face down on your deck.`)
  addEvent(privateChoiceEvent, `Your deck was ${before}.`)
  addEvent(privateChoiceEvent, `Your deck becomes ${after}.`)
  const publicChoiceEvents = addPublicEvents({
    effectPlayer: currentPlayer,
    message: `${currentPlayer.displayName} chose a scheme to put face down on their deck.`,
    playState
  })
  onChoiceComplete({
    choice,
    currentPlayer,
    playState,
    privateEvent: privateChoiceEvent,
    publicEvents: publicChoiceEvents,
    transaction
  })
  console.info(`Chose scheme with id ${props.schemeId} to put on deck!`)
})
export default deckChoose
