import { Transaction, arrayUnion } from 'firelord'
import { playersRef, profilesRef } from '../db'
import { HistoryEvent, Player, Profile, Result, Write } from '../types'

export default function choiceUpdatePlayer ({
  choiceChanges,
  current,
  player,
  playerChanges,
  profileChanges,
  profileChanged,
  privateEvents,
  publicEvents,
  sharedEvents,
  transaction
}: {
  choiceChanges: Write<Player>
  current: boolean
  playerChanges: Write<Player>
  profileChanges: Write<Profile>
  profileChanged: boolean
  player: Result<Player>
  privateEvents: HistoryEvent[]
  publicEvents: HistoryEvent[]
  sharedEvents: HistoryEvent[]
  transaction: Transaction
}): void {
  const playerRef = playersRef.doc(player.id)
  if (current) {
    const playerUpdate = {
      ...playerChanges,
      ...choiceChanges,
      history: arrayUnion(...privateEvents, ...sharedEvents)
    }
    transaction.update(playerRef, playerUpdate)
    const profileRef = profilesRef.doc(player.id)
    if (profileChanged) {
      transaction.update(profileRef, profileChanges)
    }
    return
  }
  choiceChanges.history = arrayUnion(...publicEvents, ...sharedEvents)
  transaction.update(playerRef, choiceChanges)
}
