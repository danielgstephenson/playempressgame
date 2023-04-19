import { SchemeEffectProps, SchemeResult } from '../types'
import createEvent from '../create/event'
import copyScheme from '../copyScheme'
import getTop from '../get/top'
import getLowestRankScheme from '../get/lowestRankScheme'
import isGreenOrYellow from '../is/greenOrYellow'
import isGreen from '../is/green'

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
  playSchemes
}: SchemeEffectProps): SchemeResult {
  const firstEvent = createEvent('First, if your top discard scheme is green or yellow, copy it.')
  const top = getTop(discard)
  const topRank = String(top?.rank)
  const topColor = String(top?.color)
  const topMessage = `Your top discard scheme is ${topRank}, which is ${topColor}.`
  const nonMessage = top == null ? 'Your discard is empty' : `Your top discard scheme is ${topRank}, which is red.`
  const greenOrYellow = isGreenOrYellow(top)
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
    event: firstEvent
  })
  const secondEvent = createEvent('Second, you copy the lowest rank green or yellow scheme in play.')
  const colorSchemes = playSchemes.filter(scheme => isGreenOrYellow(scheme))
  const colorScheme = getLowestRankScheme(colorSchemes)
  const colorRank = String(colorScheme?.rank)
  const colorMessage = `The lowest rank green or yellow scheme in play is ${colorRank}`
  const {
    appointments: colorAppointments,
    choices: colorChoices,
    deck: colorDeck,
    discard: colorDiscard,
    gold: colorGold,
    hand: colorHand
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
    scheme: colorScheme,
    message: colorMessage,
    nonMessage: 'There are no green or yellow schemes in play.',
    event: secondEvent
  })
  return {
    appointments: colorAppointments,
    choices: colorChoices,
    deck: colorDeck,
    discard: colorDiscard,
    gold: colorGold,
    hand: colorHand,
    playerEvents: [firstEvent, secondEvent]
  }
}
