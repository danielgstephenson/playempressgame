import { SchemeEffectProps, EffectResult } from '../types'
import createEvent from '../create/event'
import guardSchemeData from '../guard/schemeData'
import guardDefined from '../guard/defined'
import getLowestRankScheme from '../get/lowestRankScheme'
import isGreen from '../is/green'
import earn from '../earn'
import addEvent from '../addEvent'

export default function effectSeven ({
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
  const firstEvent = createEvent('First, if the left two timeline schemes are the same color, you earn the higher rank.')
  const leftTwo = passedTimeline.slice(0, 2)
  function isSame (): boolean {
    if (leftTwo.length === 0) {
      addEvent(firstEvent, 'The timeline is empty.')
      return false
    }
    if (leftTwo.length === 1) {
      addEvent(firstEvent, 'The timeline has only one scheme.')
      return false
    }
    const colors = leftTwo.map(scheme => guardSchemeData(scheme.rank).color)
    const same = colors.every(color => color === colors[0])
    const first = guardDefined(leftTwo[0], 'First timeline')
    const second = guardDefined(leftTwo[1], 'Second timeline')
    const twoMessage = same
      ? `The left two timeline schemes are ${first.color}.`
      : 'The left two timeline schemes are different colors.'
    const twoEvent = createEvent(twoMessage)
    firstEvent.children.push(twoEvent)
    if (!same) {
      const firstMessage = `The first timeline scheme, ${first.rank}, is ${first.color}.`
      addEvent(twoEvent, firstMessage)
      const secondMessage = `The second timeline scheme, ${second.rank}, is ${second.color}.`
      addEvent(twoEvent, secondMessage)
    } else {
      const higherMessage = `The higher rank scheme is ${second.rank}.`
      addEvent(firstEvent, higherMessage)
    }
    return same
  }
  const same = isSame()
  const leftBonus = same ? leftTwo[1]?.rank : 0
  const { gold: leftGold, silver: leftSilver } = earn({
    baseGold: gold,
    baseSilver: silver,
    condition: same,
    bonus: leftBonus,
    event: firstEvent
  })
  const secondEvent = createEvent('Second, if the lowest rank scheme in play is green, you earn 10 gold.')
  const lowest = getLowestRankScheme(playSchemes)
  const lowestRank = String(lowest?.rank)
  const rankMessage = `The lowest rank scheme in play, ${lowestRank},`
  const green = isGreen(lowest)
  const { gold: greenGold, silver: greenSilver } = earn({
    baseGold: leftGold,
    baseSilver: leftSilver,
    condition: green,
    bonus: 10,
    event: secondEvent,
    message: `${rankMessage} is green.`,
    nonMessage: `${rankMessage} is not green.`
  })
  return {
    effectSummons: appointments,
    effectChoices: choices,
    effectDeck: deck,
    effectDiscard: discard,
    effectHand: hand,
    effectGold: greenGold,
    effectPlayerEvents: [firstEvent, secondEvent],
    effectSilver: greenSilver
  }
}
