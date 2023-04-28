import { SchemeEffectProps, EffectResult } from '../types'
import createEvent from '../create/event'
import getTopScheme from '../get/topScheme'
import isYellow from '../is/yellow'
import earn from '../earn'

export default function effectSeventeen ({
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
  const firstEvent = createEvent('First, if your top discard scheme is yellow, you earn twice its rank.')
  const topScheme = getTopScheme(discard)
  const topRank = String(topScheme?.rank)
  const topColor = String(topScheme?.color)
  const discardFull = topScheme != null
  const fullMessage = `Your top discard scheme, ${topRank}, is ${topColor}.`
  const nonMessage = discardFull
    ? fullMessage
    : 'Your discard is empty'
  const discardYellow = discardFull && isYellow(topScheme)
  const twiceGold = discardYellow ? (topScheme.rank * 2) : 0
  const { gold: topGold, silver: topSilver } = earn({
    baseGold: gold,
    baseSilver: silver,
    bonus: twiceGold,
    condition: discardYellow,
    event: firstEvent,
    nonMessage,
    message: fullMessage
  })
  const secondEvent = createEvent('Second, you put your top discard scheme face down on your deck.')
  if (discardFull) {
    secondEvent.children.push(createEvent(`Your top discard scheme is ${topRank}.`))
    secondEvent.children.push(createEvent(`You put your ${topRank} face down on your deck.`))
  } else {
    secondEvent.children.push(createEvent('Your discard is empty'))
  }
  const discardDeck = discardFull ? [...deck, topScheme] : deck
  const discardDiscard = discardFull ? discard.slice(0, -1) : discard
  return {
    effectSummons: appointments,
    effectChoices: choices,
    effectDeck: discardDeck,
    effectDiscard: discardDiscard,
    effectGold: topGold,
    effectHand: hand,
    effectPlayerEvents: [firstEvent, secondEvent],
    effectSilver: topSilver
  }
}
