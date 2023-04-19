import { HistoryEvent } from '../types'

export default function createEvent (message: string, children: HistoryEvent[] = []): HistoryEvent {
  return {
    message,
    timestamp: Date.now(),
    children
  }
}
