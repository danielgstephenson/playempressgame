import addEvent from '../addEvent'
import getGrammar from '../get/grammar'
import getJoinedRanks from '../get/joined/ranks'
import { DrawResult, HistoryEvent, Scheme } from '../types'
import drawMultiple from './multiple'

export default function draw ({
  condition = true,
  deck,
  depth,
  discard,
  event,
  hand,
  message,
  nonMessage
}: {
  condition?: boolean
  deck: Scheme[]
  depth?: number | undefined
  discard: Scheme[]
  event: HistoryEvent
  hand: Scheme[]
  message?: string
  nonMessage?: string
}): DrawResult {
  const nonResult = {
    drawnDeck: deck,
    drawnDiscard: discard,
    drawnHand: hand
  }
  if (!condition) {
    if (nonMessage != null) {
      addEvent(event, nonMessage)
    }
    return nonResult
  }
  if (depth == null || depth === 0) {
    return nonResult
  }
  if (message != null) {
    addEvent(event, message)
  }
  const {
    drawnHand,
    drawnDeck,
    drawnDiscard,
    deckDrawn,
    discardDrawn,
    flipped,
    privilegeTaken
  } = drawMultiple({
    deck,
    depth,
    discard,
    hand
  })
  const deckDrawnRanks = getJoinedRanks(deckDrawn)
  const { count, all } = getGrammar(deckDrawn.length, 'scheme', 'schemes')
  if (deck.length === 0) {
    addEvent(event, 'Your deck is empty.')
  } else if (deck.length < depth) {
    addEvent(event, `Your deck only has ${count}, ${deckDrawnRanks}, so you draw ${all}.`)
  } else {
    addEvent(event, `You draw ${count} from your deck, ${deckDrawnRanks}.`)
  }
  if (flipped) {
    const flipMessage = 'You flip your discard pile to refresh your deck'
    addEvent(event, flipMessage)
    const { count, all } = getGrammar(discardDrawn.length, 'scheme', 'schemes')
    const discardDrawnRanks = getJoinedRanks(discardDrawn)
    if (discardDrawn.length === discard.length) {
      const message = `Your refreshed deck only has ${count}, ${discardDrawnRanks}, so you draw ${all}.`
      addEvent(event, message)
    } else {
      const message = `You draw ${count} from your refreshed deck, ${discardDrawnRanks}.`
      addEvent(event, message)
    }
  }
  if (privilegeTaken.length > 0) {
    const message = `Your deck and discard are empty, so you take ${privilegeTaken.length} Privilege into your hand.`
    addEvent(event, message)
  }
  return {
    drawnDeck,
    drawnDiscard,
    drawnHand
  }
}
