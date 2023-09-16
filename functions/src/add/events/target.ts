import { HistoryEvent, PlayState, TargetEvents } from '../../types'
import addEvent from '../event'
import addPlayerEvent from '../event/player'

export default function addTargetEvents ({
  message,
  observerMessage,
  playerMessage,
  playState,
  roundEvent,
  targetMessages
}: {
  playState: PlayState
  targetMessages?: Record<string, string>
  roundEvent?: boolean
} & ({
  message?: string
  observerMessage: string
  playerMessage: string
} | {
  message: string
  observerMessage?: string
  playerMessage: string
} | {
  message: string
  observerMessage: string
  playerMessage?: string
} | {
  message: string
  observerMessage?: string
  playerMessage?: string
})): TargetEvents {
  const publicMessage = observerMessage ?? message
  if (publicMessage == null) {
    throw new Error('Some message for observers is required.')
  }
  const observerEvent = addEvent(playState.game, publicMessage, [], roundEvent)
  const publicEvents: HistoryEvent[] = []
  const targetEvents: Record<string, HistoryEvent> = {}
  const otherPlayerEvents: HistoryEvent[] = []
  const playerEvents = playState.players.map(player => {
    const targetMessage = targetMessages?.[player.id]
    const privateMessage = targetMessage ?? playerMessage ?? message
    if (privateMessage == null) {
      throw new Error('Some message for players is required.')
    }
    const event = addPlayerEvent({
      container: player,
      message: privateMessage,
      playerId: player.id,
      round: playState.game.round,
      roundEvent
    })
    if (targetMessage == null) {
      otherPlayerEvents.push(event)
      publicEvents.push(event)
    } else {
      targetEvents[player.id] = event
    }
    return event
  })
  const events = [observerEvent, ...playerEvents]
  return {
    events,
    observerEvent,
    targetEvents,
    publicEvents,
    otherPlayerEvents,
    playerEvents
  }
}
