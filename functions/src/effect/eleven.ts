import { SchemeEffectProps, EffectResult } from '../types'
import createEvent from '../create/event'
import copyEffect from './copy'
import getTopScheme from '../get/topScheme'
import getLowestRankScheme from '../get/lowestRankScheme'
import isGreenOrYellow from '../is/greenOrYellow'

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
  const greenOrYellow = isGreenOrYellow(top)
  const {
    effectAppointments: playAppointments,
    effectChoices: playChoices,
    effectDeck: playDeck,
    effectDiscard: playDiscard,
    effectGold: playGold,
    effectHand: playHand,
    effectSilver: playSilver
  } = copyEffect({
    appointments,
    choices,
    condition: greenOrYellow,
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
  const colorSchemes = playSchemes.filter(scheme => isGreenOrYellow(scheme))
  const colorScheme = getLowestRankScheme(colorSchemes)
  const colorRank = String(colorScheme?.rank)
  const colorMessage = `The lowest rank green or yellow scheme in play is ${colorRank}`
  const {
    effectAppointments: colorAppointments,
    effectChoices: colorChoices,
    effectDeck: colorDeck,
    effectDiscard: colorDiscard,
    effectGold: colorGold,
    effectHand: colorHand,
    effectSilver: colorSilver
  } = copyEffect({
    appointments: playAppointments,
    choices: playChoices,
    deck: playDeck,
    discard: playDiscard,
    dungeon,
    gold: playGold,
    passedTimeline,
    hand: playHand,
    playerId,
    playSchemes,
    scheme: colorScheme,
    message: colorMessage,
    nonMessage: 'There are no green or yellow schemes in play.',
    event: secondEvent,
    silver: playSilver
  })
  return {
    effectAppointments: colorAppointments,
    effectChoices: colorChoices,
    effectDeck: colorDeck,
    effectDiscard: colorDiscard,
    effectGold: colorGold,
    effectHand: colorHand,
    effectPlayerEvents: [firstEvent, secondEvent],
    effectSilver: colorSilver
  }
}
