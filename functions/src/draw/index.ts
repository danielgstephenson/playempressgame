import addEvent from '../addEvent'
import getGrammar from '../get/grammar'
import getRanks from '../get/ranks'
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
    privelegeTaken
  } = drawMultiple({
    deck,
    depth,
    discard,
    hand
  })
  const deckDrawnRanks = getRanks(deckDrawn)
  if (deck.length === 0) {
    addEvent(event, 'Your deck is empty.')
  } else if (deck.length < depth) {
    const { count, all } = getGrammar(deck.length, 'scheme', 'schemes')
    addEvent(event, `Your deck only has ${count}, ${deckDrawnRanks}, so you draw ${all}.`)
  } else {
    addEvent(event, `You draw ${deckDrawnRanks} from your deck.`)
  }
  if (flipped) {
    const flipMessage = 'You flip your discard pile to refresh your deck'
    addEvent(event, flipMessage)
    const discardDrawnRanks = getRanks(discardDrawn)
    if (discardDrawn.length === discard.length) {
      const { count, all } = getGrammar(discardDrawn.length, 'scheme', 'schemes')
      const message = `Your refreshed deck has only ${count}, ${discardDrawnRanks}, so you draw ${all}.`
      addEvent(event, message)
    } else {
      const message = `You draw ${discardDrawnRanks} from your refreshed deck.`
      addEvent(event, message)
    }
  }
  if (privelegeTaken.length > 0) {
    const message = `Your deck and discard are empty, so you take ${privelegeTaken.length} privelege.`
    addEvent(event, message)
  }
  return {
    drawnDeck,
    drawnDiscard,
    drawnHand
  }
}
