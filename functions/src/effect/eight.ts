import { SchemeEffectProps, SchemeResult } from '../types'
import { createEvent } from '../create/event'
import guardSchemeData from '../guard/schemeData'
import getLowestRankScheme from '../get/lowestRankScheme'
import copyScheme from '../copyScheme'

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
  const yellowSchemes = playSchemes.filter(scheme => guardSchemeData(scheme.rank).color === 'yellow')
  const yellowScheme = getLowestRankScheme(yellowSchemes)
  const {
    appointments: playAppointments,
    choices: playChoices,
    deck: playDeck,
    discard: playDiscard,
    gold: playGold,
    hand: playHand
  } = copyScheme({
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
    message: 'The lowest rank yellow scheme in play is',
    nonMessage: 'There are no yellow schemes in play.',
    event: firstEvent
  })
  const secondEvent = createEvent('Second, you copy the lowest rank green or yellow dungeon scheme.')
  const dungeonSchemes = dungeon.filter(scheme => {
    const schemeData = guardSchemeData(scheme.rank)
    return schemeData.color === 'green' || schemeData.color === 'yellow'
  })
  const dungeonScheme = getLowestRankScheme(dungeonSchemes)
  const {
    appointments: dungeonAppointments,
    choices: dungeonChoices,
    deck: dungeonDeck,
    discard: dungeonDiscard,
    gold: dungeonGold,
    hand: dungeonHand
  } = copyScheme({
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
    message: 'The lowest rank green or yellow dungeon scheme is',
    nonMessage: 'There are no green or yellow dungeon schemes.',
    event: secondEvent
  })
  return {
    appointments: dungeonAppointments,
    choices: dungeonChoices,
    deck: dungeonDeck,
    discard: dungeonDiscard,
    gold: dungeonGold,
    hand: dungeonHand,
    playerEvents: [firstEvent, secondEvent]
  }
}
