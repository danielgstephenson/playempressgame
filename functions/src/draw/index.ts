import addEvent from '../add/event'
import addEventsEverywhere from '../add/events/everywhere'
import clone from '../clone'
import getGrammar from '../get/grammar'
import getJoinedRanks from '../get/joined/ranks'
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
  const handBefore = getJoinedRanks(playerClone.hand)
  const originalHandMessage = `Your hand was ${handBefore}.`
  const deckBefore = getJoinedRanks(playerClone.deck)
  const originalDeckMessage = `Your deck was ${deckBefore}.`
  const drawState: DrawState = {
    allDrawn: [],
    beforePrivilegeHand: [],
    deckDrawn: [],
    deckDrawnDeck: [],
    deckDrawnHand: [...player.hand],
    discardDrawn: [],
    discardDrawnDeck: [],
    discardDrawnHand: [],
    discardFlipped: false,
    flippedDeck: [],
    playState,
    privilegeTaken: []
  }
  drawMultiple({
    depth,
    drawState,
    player
  })
  const deckDrawnJoined = getJoinedRanks(drawState.deckDrawnHand)
  const afterDeckMessage = `Your hand becomes ${deckDrawnJoined}.`
  const deckDrawnDeckJoined = getJoinedRanks(
    drawState.deckDrawnDeck
  )
  const deckDeckDrawnMessage = `Your deck becomes ${deckDrawnDeckJoined}.`
  const deckDrawnRanks = getJoinedRanks(drawState.deckDrawn)
  const { count, all } = getGrammar(
    drawState.deckDrawn.length, 'scheme', 'schemes'
  )
  if (playerClone.deck.length === 0) {
    addEventsEverywhere({
      privateEvent,
      publicEvents,
      suffix: 'deck is empty',
      displayName: player.displayName
    })
  } else if (playerClone.deck.length < depth) {
    const events = addEventsEverywhere({
      privateEvent,
      publicEvents,
      privateMessage: `Your deck only has ${count}, ${deckDrawnRanks}, so you draw ${all}.`,
      publicMessage: `${player.displayName}'s deck only has ${count}, so they draw ${all}.`
    })
    addEvent(events.privateEvent, originalHandMessage)
    addEvent(events.privateEvent, afterDeckMessage)
    addEvent(events.privateEvent, originalDeckMessage)
    addEvent(events.privateEvent, deckDeckDrawnMessage)
  } else {
    const events = addEventsEverywhere({
      privateEvent,
      publicEvents,
      privateMessage: `You draw ${count} from your deck, ${deckDrawnRanks}.`,
      publicMessage: `${player.displayName} draws ${count} from their deck.`
    })
    addEvent(events.privateEvent, originalHandMessage)
    addEvent(events.privateEvent, afterDeckMessage)
    addEvent(events.privateEvent, originalDeckMessage)
    addEvent(events.privateEvent, deckDeckDrawnMessage)
  }
  if (drawState.discardFlipped) {
    const events = addEventsEverywhere({
      privateEvent,
      publicEvents,
      privateMessage: 'You flip your discard pile to refresh your deck.',
      publicMessage: `${player.displayName} flips their discard pile to refresh their deck.`
    })
    const discardBefore = getJoinedRanks(playerClone.discard)
    const originalDiscardMessage = `Your discard pile was ${discardBefore}.`
    addEvent(events.privateEvent, originalDiscardMessage)
    const flippedDeckJoined = getJoinedRanks(drawState.flippedDeck)
    const flippedDeckMessage = `Your deck becomes ${flippedDeckJoined}.`
    addEvent(events.privateEvent, flippedDeckMessage)
    const deckBeforeDiscardMessage = `Your deck was ${flippedDeckJoined}.`
    const beforeDiscardHandMessage = `Your hand was ${deckDrawnJoined}.`
    const discardDrawnHandJoined = getJoinedRanks(
      drawState.discardDrawnHand
    )
    const handAfterDiscardMessage = `Your hand becomes ${discardDrawnHandJoined}.`
    const discardDrawnDeckJoined = getJoinedRanks(player.deck)
    const discardDrawnDeckMessage = `Your deck becomes ${discardDrawnDeckJoined}.`
    const { count, all } = getGrammar(
      drawState.discardDrawn.length, 'scheme', 'schemes'
    )
    const discardDrawnRanks = getJoinedRanks(drawState.discardDrawn)
    const allDiscardDrawn = drawState.discardDrawn.length === playerClone.discard.length
    if (allDiscardDrawn) {
      const privateMessage = `Your refreshed deck only has ${count}, ${discardDrawnRanks}, so you draw ${all}.`
      const publicMessage = `${player.displayName}'s refreshed deck only has ${count}, so they draw ${all}.`
      const events = addEventsEverywhere({
        privateEvent,
        publicEvents,
        privateMessage,
        publicMessage
      })
      addEvent(events.privateEvent, beforeDiscardHandMessage)
      addEvent(events.privateEvent, handAfterDiscardMessage)
      addEvent(events.privateEvent, deckBeforeDiscardMessage)
      addEvent(events.privateEvent, discardDrawnDeckMessage)
    } else {
      const privateMessage = `You draw ${count} from your refreshed deck, ${discardDrawnRanks}.`
      const publicMessage = `${player.displayName} draws ${count} from their refreshed deck.`
      const events = addEventsEverywhere({
        privateEvent,
        publicEvents,
        privateMessage,
        publicMessage
      })
      addEvent(events.privateEvent, beforeDiscardHandMessage)
      addEvent(events.privateEvent, handAfterDiscardMessage)
      addEvent(events.privateEvent, deckBeforeDiscardMessage)
      addEvent(events.privateEvent, discardDrawnDeckMessage)
    }
  }

  if (drawState.privilegeTaken.length > 0) {
    const { count } = getGrammar(drawState.privilegeTaken.length, 'Privilege', 'Privilege')
    const privateMessage = `Your deck and discard are empty, so you take ${count} into your hand.`
    const publicMessage = `${player.displayName} takes ${count} into their hand.`
    const events = addEventsEverywhere({
      privateEvent,
      publicEvents,
      privateMessage,
      publicMessage
    })
    const beforePrivilegeJoined = getJoinedRanks(
      drawState.beforePrivilegeHand
    )
    const beforePrivilegeMessage = `Your hand was ${beforePrivilegeJoined}.`
    const afterPrivilegeJoined = getJoinedRanks(player.hand)
    const afterPrivilegeMessage = `Your hand becomes ${afterPrivilegeJoined}.`
    addEvent(events.privateEvent, beforePrivilegeMessage)
    addEvent(events.privateEvent, afterPrivilegeMessage)
  }
}
