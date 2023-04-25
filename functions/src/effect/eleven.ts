import { SchemeEffectProps, EffectResult } from '../types'
import createEvent from '../create/event'
import copyEffects from './copy'
import getTopScheme from '../get/topScheme'
import getLowestRankScheme from '../get/lowestRankScheme'
import isGreenOrYellow from '../is/greenOrYellow'
import createColorsEvent from '../create/colorsEvent'

export default function effectEleven ({
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
  const firstEvent = createEvent('First, if your top discard scheme is green or yellow, copy it.')
  const top = getTopScheme(discard)
  const topRank = String(top?.rank)
  const topColor = String(top?.color)
  const topMessage = `Your top discard scheme, ${topRank}, is ${topColor}.`
  const nonMessage = top == null ? 'Your discard is empty' : `Your top discard scheme, ${topRank}, is red.`
  const discardGreenOrYellow = isGreenOrYellow(top)
  const {
    effectAppointments: discardAppointments,
    effectChoices: discardChoices,
    effectDeck: discardDeck,
    effectDiscard: discardDiscard,
    effectGold: discardGold,
    effectHand: discardHand,
    effectSilver: discardSilver
  } = copyEffects({
    appointments,
    choices,
    condition: discardGreenOrYellow,
    deck,
    discard,
    dungeon,
    gold,
    passedTimeline,
    hand,
    playerId,
    playSchemes,
    scheme: top,
    message: topMessage,
    nonMessage,
    event: firstEvent,
    silver
  })
  const secondEvent = createEvent('Second, you copy the lowest rank green or yellow scheme in play.')
  const colorPlaySchemes = playSchemes.filter(scheme => isGreenOrYellow(scheme))
  const colorPlayScheme = getLowestRankScheme(colorPlaySchemes)
  const colorPlayRank = String(colorPlayScheme?.rank)
  const colorPlayMessage = `The lowest rank green or yellow scheme in play is ${colorPlayRank}`
  const nonEvent = createColorsEvent({
    message: 'There are no green or yellow schemes in play.',
    schemes: playSchemes
  })
  const {
    effectAppointments: colorPlayAppointments,
    effectChoices: colorPlayChoices,
    effectDeck: colorPlayDeck,
    effectDiscard: colorPlayDiscard,
    effectGold: colorPlayGold,
    effectHand: colorPlayHand,
    effectSilver: colorPlaySilver
  } = copyEffects({
    appointments: discardAppointments,
    choices: discardChoices,
    deck: discardDeck,
    discard: discardDiscard,
    dungeon,
    gold: discardGold,
    passedTimeline,
    hand: discardHand,
    playerId,
    playSchemes,
    scheme: colorPlayScheme,
    message: colorPlayMessage,
    nonEvent,
    event: secondEvent,
    silver: discardSilver
  })
  return {
    effectAppointments: colorPlayAppointments,
    effectChoices: colorPlayChoices,
    effectDeck: colorPlayDeck,
    effectDiscard: colorPlayDiscard,
    effectGold: colorPlayGold,
    effectHand: colorPlayHand,
    effectPlayerEvents: [firstEvent, secondEvent],
    effectSilver: colorPlaySilver
  }
}
