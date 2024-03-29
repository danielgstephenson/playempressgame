
import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import addEventsEverywhere from '../add/events/everywhere'
import clone from '../clone'
import getGrammar from '../get/grammar'
import joinRanks from '../join/ranks'
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
}): void {
  if (depth === 0) {
    return
  }
  const playerClone = clone(player)
  const handBeforeJoined = joinRanks(playerClone.hand)
  const handBeforeMessage = `Your hand was ${handBeforeJoined}.`
  const discardBeforeJoined = joinRanks(playerClone.discard)
  const discardBeforeMessage = `Your discard was ${discardBeforeJoined}.`
  reviveMultiple({
    depth,
    playState,
    player
  })
  const revived = player.hand.filter(handScheme => {
    const fromDiscard = playerClone.discard.some(discardScheme => handScheme.id === discardScheme.id)
    return fromDiscard
  })
  const afterHandJoined = joinRanks(player.hand)
  const afterHandMessage = `Your hand becomes ${afterHandJoined}.`
  const afterDiscardJoined = joinRanks(player.discard)
  const afterDiscardMessage = `Your discard becomes ${afterDiscardJoined}.`
  const listRanks = joinRanks(revived)
  if (playerClone.discard.length === 0) {
    addEventsEverywhere({
      privateEvent,
      publicEvents,
      suffix: 'discard is empty',
      displayName: player.displayName
    })
  } else if (playerClone.discard.length < depth) {
    const { count, all } = getGrammar(playerClone.discard.length, 'scheme', 'schemes')
    const events = addEventsEverywhere({
      privateEvent,
      publicEvents,
      privateMessage: `Your discard only has ${count}, ${listRanks}, so you revive ${all}.`,
      publicMessage: `${player.displayName}'s discard only has ${count}, so they revive ${all}.`
    })
    addEvent(events.privateEvent, handBeforeMessage)
    addEvent(events.privateEvent, afterHandMessage)
    addEvent(events.privateEvent, discardBeforeMessage)
    addEvent(events.privateEvent, afterDiscardMessage)
  } else {
    const privateReviveEvent = addEvent(privateEvent, `You revive ${listRanks}.`)
    addEvent(privateReviveEvent, handBeforeMessage)
    addEvent(privateReviveEvent, afterHandMessage)
    addEvent(privateReviveEvent, discardBeforeMessage)
    addEvent(privateReviveEvent, afterDiscardMessage)
    addPublicEvent(publicEvents, `${player.displayName} revives ${listRanks}.`)
  }
}
