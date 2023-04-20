import { SchemeEffectProps, EffectResult } from '../types'
import createEvent from '../create/event'
import revive from '../revive'
import addEvent from '../addEvent'
import getRanks from '../get/ranks'
import draw from '../draw'

export default function effectTwentyFive ({
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
  const firstEvent = createEvent('First, if you have 50 or less gold, revive 5.')
  addEvent(firstEvent, `You have ${gold} gold.`)
  const low = gold <= 50
  const depth = low ? 5 : 0
  const { revivedDiscard, revivedHand } = revive({
    discard,
    event: firstEvent,
    hand,
    depth
  })
  const secondEvent = createEvent('Second, if your discard is empty, draw 5.')
  const discardRanks = getRanks(revivedDiscard)
  const empty = discard.length === 0
  const { drawnHand, drawnDeck, drawnDiscard } = draw({
    condition: empty,
    discard: revivedDiscard,
    deck,
    depth: 5,
    event: secondEvent,
    hand: revivedHand,
    message: 'Your discard is empty',
    nonMessage: `Your discard has ${revivedDiscard.length} schemes: ${discardRanks}.`
  })
  return {
    effectAppointments: appointments,
    effectChoices: choices,
    effectDeck: drawnDeck,
    effectDiscard: drawnDiscard,
    effectGold: gold,
    effectHand: drawnHand,
    effectPlayerEvents: [firstEvent, secondEvent],
    effectSilver: silver
  }
}
