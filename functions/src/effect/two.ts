import createEvent from '../create/event'
import revive from '../revive'
import { SchemeEffectProps, EffectResult } from '../types'
import draw from '../draw'
import guardLowestPlayTime from '../guard/lowestPlayTime'
import addEvent from '../add/event'
import getGrammar from '../get/grammar'

export default function effectTwo ({
  summons,
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
  const firstEvent = createEvent('First, you revive the lowest time in play')
  const lowestTime = guardLowestPlayTime(playSchemes)
  addEvent(firstEvent, `The lowest time in play is ${lowestTime}.`)
  const {
    revivedDiscard,
    revivedHand
  } = revive({
    discard,
    event: firstEvent,
    hand,
    depth: lowestTime
  })
  const { toBeCount: phrase } = getGrammar(dungeon.length)
  const secondEvent = createEvent('Second, you draw the number of schemes in the dungeon')
  addEvent(secondEvent, `There ${phrase} in the dungeon.`)
  const {
    drawnDeck,
    drawnHand,
    drawnDiscard
  } = draw({
    deck,
    discard: revivedDiscard,
    event: secondEvent,
    hand: revivedHand,
    depth: dungeon.length
  })
  return {
    effectSummons: summons,
    effectChoices: choices,
    effectDeck: drawnDeck,
    effectDiscard: drawnDiscard,
    effectGold: gold,
    effectHand: drawnHand,
    effectPlayerEvents: [firstEvent, secondEvent],
    effectSilver: silver
  }
}
