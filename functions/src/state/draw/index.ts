import addEvent from '../../add/event'
import addPublicEvent from '../../add/publicEvent'
import clone from '../../clone'
import getGrammar from '../../get/grammar'
import getJoinedRanks from '../../get/joined/ranks'
import { HistoryEvent, PlayState, Player, PublicEvents, Result } from '../../types'
import drawMultipleState from './multiple'

export default function drawState ({
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
  const drawnState = drawMultipleState({
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
    addEvent(privateEvent, 'Your deck is empty.')
    addPublicEvent(publicEvents, `${player.displayName}'s deck is empty.`)
  } else if (playerClone.deck.length < depth) {
    addEvent(privateEvent, `Your deck only has ${count}, ${deckDrawnRanks}, so you draw ${all}.`)
    addPublicEvent(publicEvents, `${player.displayName}'s deck only has ${count}, so they draw ${all}.`)
  } else {
    addEvent(privateEvent, `You draw ${count} from your deck, ${deckDrawnRanks}.`)
    addPublicEvent(publicEvents, `${player.displayName} draws ${count} from their deck.`)
  }
  if (flipped) {
    addEvent(privateEvent, 'You flip your discard pile to refresh your deck')
    addPublicEvent(publicEvents, `${player.displayName} flips their discard pile to refresh their deck`)
    const { count, all } = getGrammar(discardDrawn.length, 'scheme', 'schemes')
    const discardDrawnRanks = getJoinedRanks(discardDrawn)
    if (discardDrawn.length === playerClone.discard.length) {
      const privateMessage = `Your refreshed deck only has ${count}, ${discardDrawnRanks}, so you draw ${all}.`
      addEvent(privateEvent, privateMessage)
      const publicMessage = `${player.displayName}'s refreshed deck only has ${count}, so they draw ${all}.`
      addPublicEvent(publicEvents, publicMessage)
    } else {
      const privateMessage = `You draw ${count} from your refreshed deck, ${discardDrawnRanks}.`
      addEvent(privateEvent, privateMessage)
      const publicMessage = `${player.displayName} draws ${count} from their refreshed deck.`
      addPublicEvent(publicEvents, publicMessage)
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
    addEvent(privateEvent, privateMessage)
    const publicMessage = `${player.displayName} takes ${privilegeTaken.length} Privilege into their hand.`
    addPublicEvent(publicEvents, publicMessage)
  }
  return drawnState
}
