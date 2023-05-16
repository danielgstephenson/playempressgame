import guardPlayHandScheme from '../../guard/playHandScheme'
import sortChildren from '../../sort/children'
import { PublicEvents, HistoryEvent, PlayState, Scheme, PlayEvents } from '../../types'
import addPlayerEvents from './player'
import addPlayerEvent from '../event/player'
import addPublicEvent from '../event/public'

export default function addSortedPlayerEvents ({
  publicEvents,
  privateEvent,
  publicMessage,
  privateMessage,
  playerId,
  playState,
  templateCallback
}: {
  publicEvents: PublicEvents
  privateEvent: HistoryEvent
  publicMessage: string
  privateMessage: string
  playerId: string
  playState: PlayState
  templateCallback?: (scheme: Scheme) => string
}): PlayEvents {
  const sortedPublicEvents = addPublicEvent(publicEvents, publicMessage)
  const sortedPrivateEvent = addPlayerEvent({
    events: privateEvent.children,
    message: privateMessage,
    playerId,
    round: playState.game.round
  })
  playState.players.forEach(player => {
    const playScheme = guardPlayHandScheme(player)
    const playMessage = `played ${playScheme.rank}`
    const schemeMessage = templateCallback == null
      ? playMessage
      : `${playMessage}, ${templateCallback(playScheme)}`
    const publicMessage = `${player.displayName} ${schemeMessage}.`
    const privateMessage = `You ${schemeMessage}.`
    addPlayerEvents({
      publicEvents: sortedPublicEvents,
      privateEvent: sortedPrivateEvent,
      publicMessage,
      privateMessage,
      playerId: player.id,
      privateId: playerId,
      round: playState.game.round
    })
  })
  sortedPublicEvents.otherPlayerEvents.forEach(sortChildren)
  sortChildren(sortedPrivateEvent)

  return {
    privateEvent: sortedPrivateEvent,
    publicEvents: sortedPublicEvents
  }
}
