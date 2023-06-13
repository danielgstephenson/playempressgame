import { HistoryEvent, PlayState, TargetEvents } from '../../types'
import addEvent from '../event'

export default function addTargetEvents ({
  message,
  observerMessage,
  playerMessage,
  playState,
  targetMessages
}: {
  playState: PlayState
  targetMessages?: Record<string, string>
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
  const observerEvent = addEvent(playState.game, publicMessage)
  const targetEvents: Record<string, HistoryEvent> = {}
  const otherPlayerEvents: HistoryEvent[] = []
  const playerEvents = playState.players.map(player => {
    const targetMessage = targetMessages?.[player.id]
    const privateMessage = targetMessage ?? playerMessage ?? message
    if (privateMessage == null) {
      throw new Error('Some message for players is required.')
    }
    const event = addEvent(player, privateMessage)
    if (targetMessage == null) {
      otherPlayerEvents.push(event)
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
    otherPlayerEvents,
    playerEvents
  }
}
