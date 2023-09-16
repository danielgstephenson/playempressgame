import { HistoryEvent } from '../../types'
import createId from '../id'

export default function createEvent (message: string, events: HistoryEvent[] = [], roundEvent?: boolean | undefined): HistoryEvent {
  const event = {
    message,
    timestamp: Date.now(),
    events,
    id: createId(),
    roundEvent
  }
  return event
}
