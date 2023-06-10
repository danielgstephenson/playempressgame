import { HistoryEvent, PublicEvents } from '../../../types'
import addEvent from '../../event'
import addPlayerEvent from '../../event/player'

export default function addPlayerEvents ({
  publicEvents,
  privateEvent,
  publicMessage,
  privateMessage,
  playerId,
  privateId,
  round
}: {
  publicEvents: PublicEvents
  privateEvent: HistoryEvent
  publicMessage: string
  privateMessage: string
  playerId: string
  privateId: string
  round: number
}): void {
  addEvent(publicEvents.observerEvent, publicMessage)
  if (playerId === privateId) {
    addEvent(privateEvent, privateMessage)
    return
  }
  publicEvents.otherPlayerEvents.forEach(otherPlayerEvent => {
    if (otherPlayerEvent.playerId === playerId) {
      addPlayerEvent({
        container: otherPlayerEvent,
        message: privateMessage,
        playerId,
        round
      })
    } else {
      addPlayerEvent({
        container: otherPlayerEvent,
        message: publicMessage,
        playerId,
        round
      })
    }
  })
  addEvent(privateEvent, publicMessage)
}
