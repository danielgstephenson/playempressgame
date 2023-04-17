import { SchemeEffectProps, SchemeResult } from '../types'
import { createEvent } from '../create/event'
import guardSchemeData from '../guard/schemeData'
import copyScheme from '../copyScheme'
import getHighestRankScheme from '../get/highestRankScheme'

export default function effectNine ({
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
  const firstEvent = createEvent('First, you copy the leftmost yellow timeline scheme.')
  const yellowSchemes = passedTimeline.filter(scheme => guardSchemeData(scheme.rank).color === 'yellow')
  const yellowScheme = yellowSchemes[0]
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
    message: 'The leftmost yellow timeline scheme is',
    nonMessage: 'There are no yellow timeline schemes.',
    event: firstEvent
  })
  const secondEvent = createEvent('Second, you copy the highest rank green dungeon scheme.')
  const dungeonSchemes = dungeon.filter(scheme => {
    const schemeData = guardSchemeData(scheme.rank)
    return schemeData.color === 'green'
  })
  const dungeonScheme = getHighestRankScheme(dungeonSchemes)
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
    message: 'The highest rank green dungeon scheme is',
    nonMessage: 'There are no green dungeon schemes.',
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
