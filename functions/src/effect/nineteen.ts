import { SchemeEffectProps, EffectResult } from '../types'
import createEvent from '../create/event'
import isYellow from '../is/yellow'
import getHighestRankScheme from '../get/highestRankScheme'
import earn from '../earn'
import createColorsEvent from '../create/event/colors'

export default function effectNineteen ({
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
  const firstEvent = createEvent("First, earn the leftmost timeline scheme's rank.")
  const left = passedTimeline[0]
  const leftRank = String(left?.rank)
  const { gold: leftGold, silver: leftSilver } = earn({
    baseGold: gold,
    baseSilver: silver,
    bonus: left?.rank,
    event: firstEvent,
    message: `The leftmost timeline scheme is ${leftRank}.`,
    nonMessage: 'The timeline is empty.'
  })
  const secondEvent = createEvent('Second, earn the highest yellow rank in play.')
  const yellowSchemes = playSchemes.filter(isYellow)
  const highestYellow = getHighestRankScheme(yellowSchemes)
  const highestRank = String(highestYellow?.rank)
  const nonEvent = createColorsEvent({
    message: 'There are no yellow schemes in play.',
    schemes: playSchemes
  })
  const { gold: highestGold, silver: highestSilver } = earn({
    baseGold: leftGold,
    baseSilver: leftSilver,
    bonus: highestYellow?.rank,
    event: secondEvent,
    message: `The highest rank yellow scheme in play is ${highestRank}.`,
    nonEvent
  })
  return {
    effectSummons: summons,
    effectChoices: choices,
    effectDeck: deck,
    effectDiscard: discard,
    effectGold: highestGold,
    effectHand: hand,
    effectPlayerEvents: [firstEvent, secondEvent],
    effectSilver: highestSilver
  }
}
