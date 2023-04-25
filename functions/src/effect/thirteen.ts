import { SchemeEffectProps, EffectResult } from '../types'
import createEvent from '../create/event'
import copyEffect from './copy'
import getHighestRankScheme from '../get/highestRankScheme'
import getJoinedRanks from '../get/joined/ranks'
import getGrammar from '../get/grammar'
import isGreenOrYellow from '../is/greenOrYellow'
import isRed from '../is/red'
import addEvent from '../addEvent'
import createColorsEvent from '../create/colorsEvent'

export default function effectThirteen ({
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
  const firstEvent = createEvent('First, if there are no red timeline schemes, you copy the leftmost timeline scheme.')
  const redSchemes = passedTimeline.filter(isRed)
  const noRed = redSchemes.length === 0
  if (noRed) {
    const { verb, noun } = getGrammar(redSchemes.length, 'scheme', 'schemes')
    const redRanks = getJoinedRanks(redSchemes)
    addEvent(firstEvent, `There ${verb} red timeline ${noun}, ${redRanks}.`)
  } else {
    const colorsEvent = createColorsEvent({
      message: 'There are no red timeline schemes',
      schemes: passedTimeline
    })
  }
  const redRanks = getJoinedRanks(redSchemes)
  const left = passedTimeline[0]
  const leftRank = String(left?.rank)
  const leftMessage = `The leftmost timeline scheme is ${leftRank}.`
  const { verb, noun } = getGrammar(redSchemes.length, 'scheme', 'schemes')
  const leftNonMessage = noRed
    ? `The red timeline ${noun} ${verb} ${redRanks}.`
    : 'The timeline is empty.'
  const {
    effectAppointments: leftAppointements,
    effectChoices: leftChoices,
    effectDeck: leftDeck,
    effectDiscard: leftDiscard,
    effectGold: leftGold,
    effectHand: lefthand,
    effectSilver: leftSilver
  } = copyEffect({
    appointments,
    choices,
    condition: noRed,
    deck,
    discard,
    dungeon,
    gold,
    passedTimeline,
    hand,
    playerId,
    playSchemes,
    scheme: left,
    message: leftMessage,
    nonMessage: leftNonMessage,
    event: firstEvent,
    silver
  })
  const secondEvent = createEvent('Second, you copy the highest rank green or yellow scheme in play.')
  const colorSchemes = playSchemes.filter(scheme => isGreenOrYellow(scheme))
  const colorScheme = getHighestRankScheme(colorSchemes)
  const colorRank = String(colorScheme?.rank)
  const colorMessage = `The highest rank green or yellow scheme in play is ${colorRank}.`
  const nonEvent = createColorsEvent({
    message: 'There are no green or yellow schemes in play.',
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
    appointments: leftAppointements,
    choices: leftChoices,
    deck: leftDeck,
    discard: leftDiscard,
    dungeon,
    gold: leftGold,
    passedTimeline,
    hand: lefthand,
    playerId,
    playSchemes,
    scheme: colorScheme,
    message: colorMessage,
    nonEvent,
    event: secondEvent,
    silver: leftSilver
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
