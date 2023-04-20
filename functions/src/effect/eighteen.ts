import { SchemeEffectProps, EffectResult } from '../types'
import createEvent from '../create/event'
import createPrivelege from '../create/privelege'
import earn from '../earn'
import getGrammar from '../get/grammar'

export default function effectEighteen ({
  appointments,
  choices,
  deck,
  discard,
  dungeon,
  gold,
  passedTimeline,
  hand,
  playerId,
  playSchemes,
  silver
}: SchemeEffectProps): EffectResult {
  const firstEvent = createEvent('First, if your deck or discard is empty, earn 30 gold.')
  const emptyDeck = deck.length === 0
  const emptyStack = emptyDeck || discard.length === 0
  const { noun: discardNoun } = getGrammar(discard.length)
  const { noun: deckNoun } = getGrammar(deck.length)
  const nonMessage = emptyDeck
    ? `Your discard has ${discard.length} ${discardNoun}.`
    : `Your deck has ${deck.length} ${deckNoun}.`
  const { gold: emptyGold, silver: emptySilver } = earn({
    baseGold: gold,
    baseSilver: silver,
    bonus: 30,
    condition: emptyStack,
    event: firstEvent,
    message: 'Your deck and discard are empty.',
    nonMessage
  })
  const secondEvent = createEvent('Second, appoint 1 privelege from the bank to the court.')
  const effectAppointments = [...appointments, ...createPrivelege(1)]
  return {
    effectAppointments,
    effectChoices: choices,
    effectDeck: deck,
    effectDiscard: discard,
    effectGold: emptyGold,
    effectHand: hand,
    effectPlayerEvents: [firstEvent, secondEvent],
    effectSilver: emptySilver
  }
}
