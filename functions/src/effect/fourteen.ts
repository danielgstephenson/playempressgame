import { SchemeEffectProps, EffectResult } from '../types'
import createEvent from '../create/event'
import copyEffect from './copy'
import getHighestRankScheme from '../get/highestRankScheme'
import isGreenOrYellow from '../is/greenOrYellow'
import isYellow from '../is/yellow'
import createColorsEvent from '../create/colorsEvent'

export default function effectFourteen ({
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
  const firstEvent = createEvent('First, if there is a lower rank scheme in play, copy the rightmost yellow timeline scheme.')
  const lowerSchemes = playSchemes.filter(scheme => scheme.rank < 14)
  const yellowSchemes = passedTimeline.filter(isYellow)
  const right = yellowSchemes.length === 0 ? undefined : yellowSchemes[yellowSchemes.length - 1]
  const rightRank = String(right?.rank)
  const rightMessage = `The rightmost yellow timeline scheme is ${rightRank}.`
  const noLower = lowerSchemes.length === 0
  const rightNonMessage = noLower
    ? 'There are no lower rank schemes in play.'
    : 'There are no yellow timeline schemes.'
  const {
    effectAppointments: rightAppointments,
    effectChoices: rightChoices,
    effectDeck: rightDeck,
    effectDiscard: rightDiscard,
    effectGold: rightGold,
    effectHand: rightHand,
    effectSilver: rightSilver
  } = copyEffect({
    appointments,
    choices,
    condition: noLower,
    deck,
    discard,
    dungeon,
    gold,
    passedTimeline,
    hand,
    playerId,
    playSchemes,
    scheme: right,
    message: rightMessage,
    nonMessage: rightNonMessage,
    event: firstEvent,
    silver
  })
  const secondEvent = createEvent('Second, you copy the highest rank green or yellow dungeon scheme.')
  const colorSchemes = dungeon.filter(scheme => isGreenOrYellow(scheme))
  const colorScheme = getHighestRankScheme(colorSchemes)
  const colorRank = String(colorScheme?.rank)
  const colorMessage = `The highest rank green or yellow dungeon scheme is ${colorRank}.`
  const nonEvent = createColorsEvent({
    message: 'There are no yellow schemes in play.',
    schemes: playSchemes
  })
  const {
    effectAppointments: colorAppointments,
    effectChoices: colorChoices,
    effectDeck: colorDeck,
    effectDiscard: colorDiscard,
    effectGold: colorGold,
    effectHand: colorHand,
    effectSilver: colorSilver
  } = copyEffect({
    appointments: rightAppointments,
    choices: rightChoices,
    deck: rightDeck,
    discard: rightDiscard,
    dungeon,
    gold: rightGold,
    passedTimeline,
    hand: rightHand,
    playerId,
    playSchemes,
    scheme: colorScheme,
    message: colorMessage,
    nonEvent,
    event: secondEvent,
    silver: rightSilver
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
