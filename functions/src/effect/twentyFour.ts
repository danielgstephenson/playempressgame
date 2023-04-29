import { SchemeEffectProps, EffectResult } from '../types'
import createEvent from '../create/event'
import revive from '../revive'
import getLowestRankScheme from '../get/lowestRankScheme'
import earn from '../earn'
import createColorsEvent from '../create/colorsEvent'

export default function effectTwentyFour ({
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
  const firstEvent = createEvent('First, earn the lowest green rank in play.')
  const low = getLowestRankScheme(playSchemes)
  const lowRank = String(low?.rank)
  const nonEvent = createColorsEvent({
    message: 'There are no green schemes in play.',
    schemes: playSchemes
  })
  const { gold: lowGold, silver: lowSilver } = earn({
    baseGold: gold,
    baseSilver: silver,
    bonus: low?.rank,
    event: firstEvent,
    message: `The lowest rank green scheme in play is ${lowRank}.`,
    nonEvent
  })
  const secondEvent = createEvent('Second, revive your entire discard.')
  const { revivedDiscard, revivedHand } = revive({
    discard,
    event: secondEvent,
    hand,
    depth: discard.length
  })
  return {
    effectSummons: summons,
    effectChoices: choices,
    effectDeck: deck,
    effectDiscard: revivedDiscard,
    effectGold: lowGold,
    effectHand: revivedHand,
    effectPlayerEvents: [firstEvent, secondEvent],
    effectSilver: lowSilver
  }
}
