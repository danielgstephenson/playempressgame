import addEvent from '../add/event'
import addEventsEverywhere from '../add/events/everywhere'
import clone from '../clone'
import getGrammar from '../get/grammar'
import joinRanks from '../join/ranks'
import { HistoryEvent, PlayState, Player, PublicEvents, Result, DrawState } from '../types'
import drawMultiple from './multiple'

export default function draw ({
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
  const handBefore = joinRanks(playerClone.hand)
  const originalHandMessage = `Your hand was ${handBefore}.`
  const reserveBefore = joinRanks(playerClone.reserve)
  const originalReserveMessage = `Your reserve was ${reserveBefore}.`
  const drawState: DrawState = {
    allDrawn: [],
    beforePrivilegeHand: [],
    drawn: [],
    drawnReserve: [],
    drawnHand: [...player.hand],
    playState,
    privilegeTaken: []
  }
  drawMultiple({
    depth,
    drawState,
    player
  })
  const drawnHandJoined = joinRanks(drawState.drawnHand)
  const afterReserveMessage = `Your hand becomes ${drawnHandJoined}.`
  const drawnReserveJoined = joinRanks(
    drawState.drawnReserve
  )
  const drawnReserveMessage = `Your reserve becomes ${drawnReserveJoined}.`
  const drawnRanks = joinRanks(drawState.drawn)
  const { count, all } = getGrammar(
    drawState.drawn.length, 'scheme', 'schemes'
  )
  if (playerClone.reserve.length === 0) {
    addEventsEverywhere({
      privateEvent,
      publicEvents,
      suffix: 'reserve is empty',
      displayName: player.displayName
    })
  } else if (playerClone.reserve.length < depth) {
    const events = addEventsEverywhere({
      privateEvent,
      publicEvents,
      privateMessage: `Your reserve only has ${count}, ${drawnRanks}, so you draw ${all}.`,
      publicMessage: `${player.displayName}'s reserve only has ${count}, so they draw ${all}.`
    })
    addEvent(events.privateEvent, originalHandMessage)
    addEvent(events.privateEvent, afterReserveMessage)
  } else {
    const events = addEventsEverywhere({
      privateEvent,
      publicEvents,
      privateMessage: `You draw ${count} from your reserve, ${drawnRanks}.`,
      publicMessage: `${player.displayName} draws ${count} from their reserve.`
    })
    addEvent(events.privateEvent, originalHandMessage)
    addEvent(events.privateEvent, afterReserveMessage)
    addEvent(events.privateEvent, originalReserveMessage)
    addEvent(events.privateEvent, drawnReserveMessage)
  }

  if (drawState.privilegeTaken.length > 0) {
    const { count } = getGrammar(drawState.privilegeTaken.length, 'Privilege', 'Privilege')
    const privateMessage = `Your reserve is empty, so you take ${count} into your hand.`
    const publicMessage = `${player.displayName} takes ${count} into their hand.`
    const events = addEventsEverywhere({
      privateEvent,
      publicEvents,
      privateMessage,
      publicMessage
    })
    const beforePrivilegeJoined = joinRanks(
      drawState.beforePrivilegeHand
    )
    const beforePrivilegeMessage = `Your hand was ${beforePrivilegeJoined}.`
    const afterPrivilegeJoined = joinRanks(player.hand)
    const afterPrivilegeMessage = `Your hand becomes ${afterPrivilegeJoined}.`
    addEvent(events.privateEvent, beforePrivilegeMessage)
    addEvent(events.privateEvent, afterPrivilegeMessage)
  }
}
