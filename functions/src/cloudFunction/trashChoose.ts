import addPublicEvents from '../add/events/public'
import createCloudFunction from '../create/cloudFunction'
import createEvent from '../create/event'
import { SchemeProps } from '../types'
import guardChoice from '../guard/choice'
import getOtherPlayers from '../get/otherPlayers'
import onChoiceComplete from '../onChoiceComplete'

const trashChoose = createCloudFunction<SchemeProps>(async (props, context, transaction) => {
  console.info(`Choosing scheme ${props.schemeId} to trash...`)
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
    label: 'Trash choice scheme'
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
  currentPlayer.trashHistory.push({ scheme, round: currentGame.round })
  playState.game.profiles.forEach(profile => {
    if (profile.userId === currentUid) {
      profile.trashHistory.push({ round: currentGame.round })
    }
  })
  const privateChoiceEvent = createEvent(`You chose scheme ${scheme.rank} to trash.`)
  currentPlayer.history.push(privateChoiceEvent)
  const publicChoiceEvents = addPublicEvents({
    effectPlayer: currentPlayer,
    message: `${currentPlayer.displayName} chose a scheme to trash.`,
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
  console.info(`Chose scheme with id ${props.schemeId} to trash!`)
})
export default trashChoose
