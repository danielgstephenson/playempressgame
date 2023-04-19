import { SchemeEffectProps, SchemeResult } from '../types'
import copyScheme from '../copyScheme'
import getHighestRankScheme from '../get/highestRankScheme'
import createEvent from '../create/event'
import isGreen from '../is/green'

export default function effectTen ({
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
  const yellowSchemes = passedTimeline.filter(scheme => scheme.color === 'Yellow')
  const yellowScheme = yellowSchemes[0]
  const yellowRank = String(yellowScheme?.rank)
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
    message: `The leftmost yellow timeline scheme is ${yellowRank}.`,
    nonMessage: 'There are no yellow timeline schemes.',
    event: firstEvent
  })
  const secondEvent = createEvent('Second, you copy the highest rank green dungeon scheme.')
  const dungeonSchemes = dungeon.filter(scheme => isGreen(scheme))
  const dungeonScheme = getHighestRankScheme(dungeonSchemes)
  const dungeonRank = String(dungeonScheme?.rank)
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
    message: `The highest rank green dungeon scheme is ${dungeonRank}.`,
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
