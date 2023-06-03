import { HistoryEvent } from '../../types'
import createId from '../id'

export default function createEvent (message: string, events: HistoryEvent[] = []): HistoryEvent {
  const event = {
    message,
    timestamp: Date.now(),
    events,
    id: createId()
  }
  return event
}
