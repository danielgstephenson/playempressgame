import addEvent from '../../add/event'
import addPublicEvent from '../../add/publicEvent'
import clone from '../../clone'
import getGrammar from '../../get/grammar'
import getJoinedRanks from '../../get/joined/ranks'
import { HistoryEvent, PlayState, Player, PublicEvents, Result } from '../../types'
import reviveMultipleState from './multiple'

export default function reviveState ({
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
  const revivedState = reviveMultipleState({
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
    addEvent(privateEvent, 'Your discard is empty.')
    addPublicEvent(publicEvents, `${player.displayName}'s discard is empty.`)
  } else if (playerClone.discard.length < depth) {
    const { count, all } = getGrammar(playerClone.discard.length, 'scheme', 'schemes')
    addEvent(privateEvent, `Your discard only has ${count}, ${listRanks}, so you revive ${all}.`)
    addPublicEvent(publicEvents, `${player.displayName}'s discard only has ${count}, so they revive ${all}.`)
  } else {
    addEvent(privateEvent, `You revive ${listRanks}.`)
    addPublicEvent(publicEvents, `${player.displayName} revives ${listRanks}.`)
  }
  return revivedState
}
