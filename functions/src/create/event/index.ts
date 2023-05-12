import { HistoryEvent } from '../../types'
import createId from '../id'

export default function createEvent (message: string, children: HistoryEvent[] = []): HistoryEvent {
  return {
    message,
    timestamp: Date.now(),
    children,
    id: createId()
  }
}
