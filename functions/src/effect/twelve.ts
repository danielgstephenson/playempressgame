import { SchemeEffectProps, SchemeResult } from '../types'
import { createEvent } from '../create/event'
import guardSchemeData from '../guard/schemeData'
import copyScheme from '../copyScheme'
import getTop from '../get/top'
import getLowestRankScheme from '../get/lowestRankScheme'

export default function effectTwelve ({
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
  const firstEvent = createEvent('First, if the leftmost timeline scheme is green or yellow, copy it.')
  const left = passedTimeline[0]
  const leftColor = String(left?.color)
  const isYellow = leftColor === 'Yellow'
  const leftRank = String(left?.rank)
  const leftMessage = `The leftmost timeline scheme is ${leftRank}, which is ${leftColor}.`
  const leftNonMessage = left == null ? 'The timeline is empty' : `The leftmost timeline scheme is ${leftRank}, which is red.`
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
    condition: isYellow,
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
  const secondEvent = createEvent('Second, you copy the highest rank green scheme in play.')
  const colorSchemes = playSchemes.filter(scheme => {
    const schemeData = guardSchemeData(scheme.rank)
    return schemeData.color === 'green' || schemeData.color === 'yellow'
  })
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
