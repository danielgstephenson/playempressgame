import { SchemeEffectProps, EffectResult } from '../types'
import createEvent from '../create/event'
import copyEffect from './copy'
import getHighestRankScheme from '../get/highestRankScheme'
import getRanks from '../get/ranks'
import getGrammar from '../get/grammar'
import isGreenOrYellow from '../is/greenOrYellow'

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
  playSchemes
}: SchemeEffectProps): EffectResult {
  const firstEvent = createEvent('First, if there are no red timeline schemes, copy the leftmost timeline scheme.')
  const redSchemes = passedTimeline.filter(scheme => scheme.color === 'Red')
  const redRanks = getRanks(redSchemes)
  const left = passedTimeline[0]
  const leftRank = String(left?.rank)
  const leftMessage = `The leftmost timeline scheme is ${leftRank}.`
  const { verb, object } = getGrammar(redSchemes.length, 'scheme', 'schemes')
  const noRed = redSchemes.length === 0
  const leftNonMessage = noRed
    ? `There ${verb} ${redSchemes.length} red timeline ${object}: ${redRanks}.`
    : 'The timeline is empty.'
  const {
    effectAppointments: leftAppointements,
    effectChoices: leftChoices,
    effectDeck: leftDeck,
    effectDiscard: leftDiscard,
    effectGold: leftGold,
    effectHand: lefthand
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
    event: firstEvent
  })
  const secondEvent = createEvent('Second, you copy the highest rank green or yellow scheme in play.')
  const colorSchemes = playSchemes.filter(scheme => isGreenOrYellow(scheme))
  const colorScheme = getHighestRankScheme(colorSchemes)
  const colorRank = String(colorScheme?.rank)
  const colorMessage = `The lowest rank green scheme in play is ${colorRank}.`
  const {
    effectAppointments: colorAppointments,
    effectChoices: colorChoices,
    effectDeck: colorDeck,
    effectDiscard: colorDiscard,
    effectGold: colorGold,
    effectHand: colorHand
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
    nonMessage: 'There are no green or yellow schemes in play.',
    event: secondEvent
  })
  return {
    effectAppointments: colorAppointments,
    effectChoices: colorChoices,
    effectDeck: colorDeck,
    effectDiscard: colorDiscard,
    effectGold: colorGold,
    effectHand: colorHand,
    effectPlayerEvents: [firstEvent, secondEvent]
  }
}
