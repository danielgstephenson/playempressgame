import sortChildren from '../../../sort/children'
import { HistoryEvent, PlayState, Scheme, PlayEvents, PlayerPublicEvents } from '../../../types'
import addPlayerEvent from '../../event/player'
import guardPlayScheme from '../../../guard/playScheme'
import addEvent from '../../event'
import addPlayerPublicEvents from './public'

export default function addSortedPlayerEvents ({
  publicEvents,
  privateEvent,
  publicMessage,
  privateMessage,
  playerId,
  playState,
  templateCallback
}: {
  publicEvents: PlayerPublicEvents
  privateEvent: HistoryEvent
  publicMessage: string
  privateMessage: string
  playerId: string
  playState: PlayState
  templateCallback?: (scheme: Scheme) => string
}): PlayEvents {
  const sortedPublicEvents = addPlayerPublicEvents({
    events: publicEvents,
    message: publicMessage
  })
  const sortedPrivateEvent = addPlayerEvent({
    container: privateEvent,
    message: privateMessage,
    playerId,
    round: playState.game.round
  })
  playState.players.forEach(otherPlayer => {
    const playScheme = guardPlayScheme(otherPlayer)
    const playMessage = `played ${playScheme.rank}`
    const schemeMessage = templateCallback == null
      ? playMessage
      : `${playMessage}, ${templateCallback(playScheme)}`
    const publicMessage = `${otherPlayer.displayName} ${schemeMessage}.`
    const privateMessage = `You ${schemeMessage}.`
    addEvent(sortedPublicEvents.observerEvent, publicMessage)
    if (otherPlayer.id === playerId) {
      addPlayerEvent({
        container: sortedPrivateEvent,
        message: privateMessage,
        playerId: otherPlayer.id,
        round: playState.game.round
      })
    } else {
      addPlayerEvent({
        container: sortedPrivateEvent,
        message: publicMessage,
        playerId: otherPlayer.id,
        round: playState.game.round
      })
    }
    sortedPublicEvents.otherPlayerEvents.forEach(otherPlayerEvent => {
      if (otherPlayerEvent.playerId === otherPlayer.id) {
        addPlayerEvent({
          container: otherPlayerEvent,
          message: privateMessage,
          playerId: otherPlayer.id,
          round: playState.game.round
        })
      } else {
        addPlayerEvent({
          container: otherPlayerEvent,
          message: publicMessage,
          playerId: otherPlayer.id,
          round: playState.game.round
        })
      }
    })
  })
  sortedPublicEvents.otherPlayerEvents.forEach(otherPlayerEvent => {
    sortChildren({ event: otherPlayerEvent, playerId })
  })
  sortChildren({ event: sortedPrivateEvent, playerId })

  return {
    privateEvent: sortedPrivateEvent,
    publicEvents: sortedPublicEvents
  }
}
