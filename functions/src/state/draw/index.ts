import addEventsEverywhere from '../../add/events/everywhere'
import clone from '../../clone'
import getGrammar from '../../get/grammar'
import getJoinedRanks from '../../get/joined/ranks'
import { HistoryEvent, PlayState, Player, PublicEvents, Result } from '../../types'
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
}): PlayState {
  const playerClone = clone(player)
  const drawnState = drawMultiple({
    depth,
    playState,
    player
  })
  const deckDrawn = player.hand.filter(handScheme => {
    const fromDeck = playerClone.deck.some(deckScheme => handScheme.id === deckScheme.id)
    return fromDeck
  })
  const discardDrawn = player.hand.filter(handScheme => {
    const fromDiscard = playerClone.discard.some(discardScheme => handScheme.id === discardScheme.id)
    return fromDiscard
  })
  const flipped = discardDrawn.length > 0
  const deckDrawnRanks = getJoinedRanks(deckDrawn)
  const { count, all } = getGrammar(deckDrawn.length, 'scheme', 'schemes')
  if (playerClone.deck.length === 0) {
    addEventsEverywhere({
      privateEvent,
      publicEvents,
      base: 'deck is empty.',
      displayName: player.displayName
    })
  } else if (playerClone.deck.length < depth) {
    addEventsEverywhere({
      privateEvent,
      publicEvents,
      privateMessage: `Your deck only has ${count}, ${deckDrawnRanks}, so you draw ${all}.`,
      publicMessage: `${player.displayName}'s deck only has ${count}, so they draw ${all}.`
    })
  } else {
    addEventsEverywhere({
      privateEvent,
      publicEvents,
      privateMessage: `You draw ${count} from your deck, ${deckDrawnRanks}.`,
      publicMessage: `${player.displayName} draws ${count} from their deck.`
    })
  }
  if (flipped) {
    addEventsEverywhere({
      privateEvent,
      publicEvents,
      privateMessage: 'You flip your discard pile to refresh your deck.',
      publicMessage: `${player.displayName} flips their discard pile to refresh their deck.`
    })
    const { count, all } = getGrammar(discardDrawn.length, 'scheme', 'schemes')
    const discardDrawnRanks = getJoinedRanks(discardDrawn)
    if (discardDrawn.length === playerClone.discard.length) {
      const privateMessage = `Your refreshed deck only has ${count}, ${discardDrawnRanks}, so you draw ${all}.`
      const publicMessage = `${player.displayName}'s refreshed deck only has ${count}, so they draw ${all}.`
      addEventsEverywhere({
        privateEvent,
        publicEvents,
        privateMessage,
        publicMessage
      })
    } else {
      const privateMessage = `You draw ${count} from your refreshed deck, ${discardDrawnRanks}.`
      const publicMessage = `${player.displayName} draws ${count} from their refreshed deck.`
      addEventsEverywhere({
        privateEvent,
        publicEvents,
        privateMessage,
        publicMessage
      })
    }
  }
  const privilegeTaken = player.hand.filter(scheme => {
    if (scheme.rank !== 1) {
      return false
    }
    const already = playerClone.hand.some(handScheme => handScheme.id === scheme.id)
    return !already
  })
  if (privilegeTaken.length > 0) {
    const privateMessage = `Your deck and discard are empty, so you take ${privilegeTaken.length} Privilege into your hand.`
    const publicMessage = `${player.displayName} takes ${privilegeTaken.length} Privilege into their hand.`
    addEventsEverywhere({
      privateEvent,
      publicEvents,
      privateMessage,
      publicMessage
    })
  }
  return drawnState
}
