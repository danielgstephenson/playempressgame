import { Transaction, arrayUnion } from 'firelord'
import { playersRef, profilesRef } from '../db'
import { HistoryEvent, PlayChanges, Player, Result, Write } from '../types'

export default function choiceUpdatePlayer ({
  choiceChanges,
  chosenPlayerHistory,
  current,
  events,
  playChanges,
  player,
  transaction
}: {
  choiceChanges: Write<Player>
  current: boolean
  events: HistoryEvent[]
  chosenPlayerHistory: HistoryEvent[]
  player: Result<Player>
  playChanges: PlayChanges
  transaction: Transaction
}): void {
  const playerRef = playersRef.doc(player.id)
  if (current) {
    chosenPlayerHistory.push(...events)
    const playerChanges = {
      ...playChanges.playerChanges,
      ...choiceChanges,
      history: chosenPlayerHistory
    }
    transaction.update(playerRef, playerChanges)
    const profileRef = profilesRef.doc(player.id)
    if (playChanges.profileChanged) {
      transaction.update(profileRef, playChanges.profileChanges)
    }
    return
  }
  choiceChanges.history = arrayUnion(...events)
  transaction.update(playerRef, choiceChanges)
}
