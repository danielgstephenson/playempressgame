import createEvent from '../create/event'
import getGrammar from '../get/grammar'
import { DrawResult, HistoryEvent, Scheme } from '../types'
import drawMultiple from './multiple'

export default function draw ({
  depth,
  discard,
  hand,
  deck
}: {
  depth: number
  discard: Scheme[]
  hand: Scheme[]
  deck: Scheme[]
}): DrawResult {
  const drawEvents: HistoryEvent[] = []
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
  if (deck.length === 0) {
    const deckEvent = createEvent('Your deck is empty.')
    drawEvents.push(deckEvent)
  } else if (deck.length < depth) {
    const deckDrawnRanks = deckDrawn.map((scheme) => scheme.rank).join(', ')
    const { count, object } = getGrammar(deck.length, 'scheme', 'schemes')
    const deckEvent = createEvent(`Your deck only has ${count}, so you draw ${object}: ${deckDrawnRanks}.`)
    drawEvents.push(deckEvent)
  } else {
    const deckDrawnRanks = deckDrawn.map((scheme) => scheme.rank).join(', ')
    const deckEvent = createEvent(`You draw ${deckDrawn.length} from your deck: ${deckDrawnRanks}.`)
    drawEvents.push(deckEvent)
  }
  if (discardDrawn.length > 0) {
    const flipMessage = 'You flip your discard pile to refresh your deck'
    const flipEvent = createEvent(flipMessage)
    drawEvents.push(flipEvent)
    const discardDrawnRanks = discardDrawn.map((scheme) => scheme.rank).join(', ')
    if (privelegeTaken.length > 0) {
      const flippedDeckEvent = createEvent(`Your refreshed deck now has only ${privelegeTaken.length} schemes, so you drawn them all: ${discardDrawnRanks}.`)
      drawEvents.push(flippedDeckEvent)
    } else {
      const flippedDeckEvent = createEvent(`You draw ${discardDrawn.length} from your refreshed deck: ${discardDrawnRanks}.`)
      drawEvents.push(flippedDeckEvent)
    }
  }
  if (privelegeTaken.length > 0) {
    const message = `Your deck and disard are empty, so you take ${privelegeTaken.length} privelege.`
    const event = createEvent(message)
    drawEvents.push(event)
  }
  return {
    deckDrawn,
    discardDrawn,
    drawnDeck,
    drawnDiscard,
    drawnHand,
    flipped,
    drawEvents,
    privelegeTaken
  }
}
