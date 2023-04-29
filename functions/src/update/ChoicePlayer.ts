import { Transaction, arrayUnion } from 'firelord'
import { playersRef, profilesRef } from '../db'
import { HistoryEvent, EffectResultChanges, Player, Result, Write } from '../types'

export default function choiceUpdatePlayer ({
  choiceChanges,
  current,
  events,
  playChanges,
  player,
  transaction
}: {
  choiceChanges: Write<Player>
  current: boolean
  events: HistoryEvent[]
  player: Result<Player>
  playChanges: EffectResultChanges
  transaction: Transaction
}): void {
  console.log('choiceUpdatePlayer', { choiceChanges, current, events, playChanges, player })
  const playerRef = playersRef.doc(player.id)
  if (current) {
    const playerChanges = {
      ...playChanges.playerChanges,
      ...choiceChanges,
      history: arrayUnion(...events)
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
