import { arrayUnion } from 'firelord'
import { HistoryEvent, HistoryUpdate } from '../types'

export default function createHistoryUpdate (...events: HistoryEvent[]): HistoryUpdate {
  const update = {
    history: arrayUnion(...events)
  }
  return update
}
