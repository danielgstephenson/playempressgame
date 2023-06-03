import { arrayUnion } from 'firelord'
import createEvent from './event'
import { HistoryUpdate } from '../types'

export default function createEventUpdate (message: string): HistoryUpdate {
  const event = createEvent(message)
  return {
    events: arrayUnion(event)
  }
}
