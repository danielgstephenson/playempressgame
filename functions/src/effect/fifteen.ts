import { SchemeEffectProps, EffectResult } from '../types'
import createEvent from '../create/event'
import copyEffect from './copy'
import getTopData from '../get/topData'
import isRed from '../is/red'
import isGreen from '../is/green'

export default function effectFifteen ({
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
  const firstEvent = createEvent('First, if your top discard scheme is red, copy the leftmost green timeline scheme.')
  const topData = getTopData(discard)
  const topRank = String(topData?.rank)
  const discardRed = isRed(topData)
  const green = passedTimeline.filter(isGreen)
  const left = green[0]
  const leftRank = String(left?.rank)
  const leftMessage = `The leftmost green timeline scheme is ${leftRank}.`
  const leftNonMessage = discardRed
    ? 'There are no green timeline schemes.'
    : discard.length === 0
      ? 'Your discard is empty.'
      : `Your top discard scheme is ${topRank}, which is not red.`
  const {
    effectAppointments: leftAppointments,
    effectChoices: leftChoices,
    effectDeck: leftDeck,
    effectDiscard: leftDiscard,
    effectGold: leftGold,
    effectHand: leftHand
  } = copyEffect({
    appointments,
    choices,
    condition: discardRed,
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
  const secondEvent = createEvent('Otherwise, copy your top discard scheme.')
  const topMessage = `Your top discard scheme is ${topRank}.`
  const topNonMessage = discardRed
    ? `Your top discard scheme is ${topRank}, which is red.`
    : 'Your discard is empty.'
  const {
    effectAppointments: colorAppointments,
    effectChoices: colorChoices,
    effectDeck: colorDeck,
    effectDiscard: colorDiscard,
    effectGold: colorGold,
    effectHand: colorHand
  } = copyEffect({
    appointments: leftAppointments,
    choices: leftChoices,
    condition: !discardRed,
    deck: leftDeck,
    discard: leftDiscard,
    dungeon,
    gold: leftGold,
    passedTimeline,
    hand: leftHand,
    playerId,
    playSchemes,
    scheme: topData,
    message: topMessage,
    nonMessage: topNonMessage,
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
