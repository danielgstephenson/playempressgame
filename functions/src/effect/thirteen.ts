import { SchemeEffectProps, SchemeResult } from '../types'
import createEvent from '../create/event'
import copyEffect from './copy'
import isGreen from '../is/green'
import getHighestRankScheme from '../get/highestRankScheme'

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
}: SchemeEffectProps): SchemeResult {
  const firstEvent = createEvent('First, if there are no red timeline schemes, copy the leftmost timeline scheme.')
  const left = passedTimeline[0]
  const leftColor = String(left?.color)
  const isYellow = leftColor === 'Yellow'
  const leftRank = String(left?.rank)
  const leftMessage = `The leftmost timeline scheme is ${leftRank}, which is ${leftColor}.`
  const leftNonMessage = left == null ? 'The timeline is empty' : `The leftmost timeline scheme is ${leftRank}, which is red.`
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
  const greenSchemes = playSchemes.filter(scheme => isGreen(scheme))
  const greenScheme = getHighestRankScheme(greenSchemes)
  const greenRank = String(greenScheme?.rank)
  const greenMessage = `The lowest rank green scheme in play is ${greenRank}.`
  const {
    effectAppointments: colorAppointments,
    effectChoices: colorChoices,
    effectDeck: colorDeck,
    effectDiscard: colorDiscard,
    effectGold: colorGold,
    effectHand: colorHand
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
    scheme: greenScheme,
    message: greenMessage,
    nonMessage: 'There are no green schemes in play.',
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
