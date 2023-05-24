
import addEventsEverywhere from '../add/events/everywhere'
import clone from '../clone'
import getGrammar from '../get/grammar'
import getJoinedRanks from '../get/joined/ranks'
import { PlayState, Result, Player, HistoryEvent, PublicEvents } from '../types'
import reviveMultiple from './multiple'

export default function revive ({
  depth,
  playState,
  player,
  privateEvent,
  publicEvents
}: {
  depth: number
  playState: PlayState
  player: Result<Player>
  privateEvent: HistoryEvent
  publicEvents: PublicEvents
}): PlayState {
  const playerClone = clone(player)
  const revivedState = reviveMultiple({
    depth,
    playState,
    player
  })
  const revived = player.hand.filter(handScheme => {
    const fromDiscard = playerClone.discard.some(discardScheme => handScheme.id === discardScheme.id)
    return fromDiscard
  })
  const listRanks = getJoinedRanks(revived)
  if (playerClone.discard.length === 0) {
    addEventsEverywhere({
      privateEvent,
      publicEvents,
      suffix: 'discard is empty',
      displayName: player.displayName
    })
  } else if (playerClone.discard.length < depth) {
    const { count, all } = getGrammar(playerClone.discard.length, 'scheme', 'schemes')
    addEventsEverywhere({
      privateEvent,
      publicEvents,
      privateMessage: `Your discard only has ${count}, ${listRanks}, so you revive ${all}.`,
      publicMessage: `${player.displayName}'s discard only has ${count}, so they revive ${all}.`
    })
  } else {
    addEventsEverywhere({
      privateEvent,
      publicEvents,
      possessive: false,
      suffix: `revives ${listRanks}`,
      displayName: player.displayName
    })
  }
  return revivedState
}
