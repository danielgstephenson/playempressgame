
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
  const reserveBeforeJoined = joinRanks(playerClone.reserve)
  const reserveBeforeMessage = `Your reserve was ${reserveBeforeJoined}.`
  reviveMultiple({
    depth,
    playState,
    player
  })
  const revived = player.hand.filter(handScheme => {
    const fromReserve = playerClone.reserve.some(reserveScheme => handScheme.id === reserveScheme.id)
    return fromReserve
  })
  const afterHandJoined = joinRanks(player.hand)
  const afterHandMessage = `Your hand becomes ${afterHandJoined}.`
  const afterReviveJoined = joinRanks(player.reserve)
  const afterReviveMessage = `Your reserve becomes ${afterReviveJoined}.`
  const listRanks = joinRanks(revived)
  if (playerClone.reserve.length === 0) {
    addEventsEverywhere({
      privateEvent,
      publicEvents,
      suffix: 'reserve is empty',
      displayName: player.displayName
    })
  } else if (playerClone.reserve.length < depth) {
    const { count, all } = getGrammar(playerClone.reserve.length, 'scheme', 'schemes')
    const events = addEventsEverywhere({
      privateEvent,
      publicEvents,
      privateMessage: `Your reserve only has ${count}, ${listRanks}, so you revive ${all}.`,
      publicMessage: `${player.displayName}'s reserve only has ${count}, so they revive ${all}.`
    })
    addEvent(events.privateEvent, handBeforeMessage)
    addEvent(events.privateEvent, afterHandMessage)
    addEvent(events.privateEvent, reserveBeforeMessage)
    addEvent(events.privateEvent, afterReviveMessage)
  } else {
    const privateReviveEvent = addEvent(privateEvent, `You revive ${listRanks}.`)
    addEvent(privateReviveEvent, handBeforeMessage)
    addEvent(privateReviveEvent, afterHandMessage)
    addEvent(privateReviveEvent, reserveBeforeMessage)
    addEvent(privateReviveEvent, afterReviveMessage)
    addPublicEvent(publicEvents, `${player.displayName} revives ${listRanks}.`)
  }
}
