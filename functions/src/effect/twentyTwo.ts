import { SchemeEffectProps, EffectResult } from '../types'
import createEvent from '../create/event'
import earn from '../earn'

export default function effectTwentyTwo ({
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
  const firstEvent = createEvent("First, earn the rightmost timeline scheme's rank.")
  const right = passedTimeline[passedTimeline.length - 1]
  const rightRank = String(right?.rank)
  const { gold: topGold, silver: topSilver } = earn({
    baseGold: gold,
    baseSilver: silver,
    bonus: right?.rank,
    event: firstEvent,
    message: `The rightmost timeline scheme is ${rightRank}.`,
    nonMessage: 'The timeline is empty.'
  })
  const secondEvent = createEvent('Second, earn 5 gold for each dungeon scheme.')
  const dungeonBonus = dungeon.length * 5
  const { gold: dungeonGold, silver: dungeonSilver } = earn({
    baseGold: topGold,
    baseSilver: topSilver,
    bonus: dungeonBonus,
    condition: dungeon.length > 0,
    event: firstEvent,
    message: `There are ${dungeon.length} dungeon schemes.`,
    nonMessage: 'The dungeon is empty.'
  })
  return {
    effectSummons: summons,
    effectChoices: choices,
    effectDeck: deck,
    effectDiscard: discard,
    effectGold: dungeonGold,
    effectHand: hand,
    effectPlayerEvents: [firstEvent, secondEvent],
    effectSilver: dungeonSilver
  }
}
