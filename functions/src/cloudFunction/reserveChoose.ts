import addPublicEvents from '../add/events/public'
import createCloudFunction from '../create/cloudFunction'
import { SchemeProps } from '../types'
import guardChoice from '../guard/choice'
import getOtherPlayers from '../get/otherPlayers'
import onChoiceComplete from '../onChoiceComplete'
import addEvent from '../add/event'
import joinRanks from '../join/ranks'

const reserveChoose = createCloudFunction<SchemeProps>(async (props, context, transaction) => {
  console.info(`Choosing scheme ${props.schemeId} to reserve to the left of their last reserve...`)
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
    label: 'Reserve choice scheme'
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
  const before = joinRanks(currentPlayer.reserve)
  const lastReserve = currentPlayer.reserve.pop()
  if (lastReserve == null) {
    throw new Error('Your reserve is empty.')
  }
  currentPlayer.reserve = [...currentPlayer.reserve, scheme, lastReserve]
  const after = joinRanks(currentPlayer.reserve)
  const privateChoiceEvent = addEvent(currentPlayer, `You chose scheme ${scheme.rank} to put to the left of you last reserve.`)
  addEvent(privateChoiceEvent, `Your reserve was ${before}.`)
  addEvent(privateChoiceEvent, `Your reserve becomes ${after}.`)
  const publicChoiceEvents = addPublicEvents({
    effectPlayer: currentPlayer,
    message: `${currentPlayer.displayName} chose a scheme to put to the left of their last reserve.`,
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
  console.info(`Chose scheme with id ${props.schemeId} to put to the let of their last reserve`)
})
export default reserveChoose
