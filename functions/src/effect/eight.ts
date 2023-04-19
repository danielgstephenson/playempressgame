import { SchemeEffectProps, SchemeResult } from '../types'
import createEvent from '../create/event'
import guardSchemeData from '../guard/schemeData'
import getLowestRankScheme from '../get/lowestRankScheme'
import copyEffect from './copy'
import isGreenOrYellow from '../is/greenOrYellow'

export default function effectEight ({
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
}: SchemeEffectProps): SchemeResult {
  const firstEvent = createEvent('First, you copy the lowest rank yellow scheme in play.')
  const yellowSchemes = playSchemes.filter(scheme => guardSchemeData(scheme.rank).color === 'Yellow')
  const yellowScheme = getLowestRankScheme(yellowSchemes)
  const yellowRank = String(yellowScheme?.rank)
  const {
    effectAppointments: playAppointments,
    effectChoices: playChoices,
    effectDeck: playDeck,
    effectDiscard: playDiscard,
    effectGold: playGold,
    effectHand: playHand
  } = copyEffect({
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
    scheme: yellowScheme,
    message: `The lowest rank yellow scheme in play is ${yellowRank}`,
    nonMessage: 'There are no yellow schemes in play.',
    event: firstEvent
  })
  const secondEvent = createEvent('Second, you copy the lowest rank green or yellow dungeon scheme.')
  const dungeonSchemes = dungeon.filter(scheme => isGreenOrYellow(scheme))
  const dungeonScheme = getLowestRankScheme(dungeonSchemes)
  const dungeonRank = String(dungeonScheme?.rank)
  const {
    effectAppointments: dungeonAppointments,
    effectChoices: dungeonChoices,
    effectDeck: dungeonDeck,
    effectDiscard: dungeonDiscard,
    effectGold: dungeonGold,
    effectHand: dungeonHand
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
    scheme: dungeonScheme,
    message: `The lowest rank green or yellow dungeon scheme is ${dungeonRank}`,
    nonMessage: 'There are no green or yellow dungeon schemes.',
    event: secondEvent
  })
  return {
    effectAppointments: dungeonAppointments,
    effectChoices: dungeonChoices,
    effectDeck: dungeonDeck,
    effectDiscard: dungeonDiscard,
    effectGold: dungeonGold,
    effectHand: dungeonHand,
    effectPlayerEvents: [firstEvent, secondEvent]
  }
}
