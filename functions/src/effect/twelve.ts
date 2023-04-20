import { SchemeEffectProps, EffectResult } from '../types'
import createEvent from '../create/event'
import copyEffect from './copy'
import isGreen from '../is/green'
import getHighestRankScheme from '../get/highestRankScheme'
import isYellow from '../is/yellow'

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
  playSchemes,
  silver
}: SchemeEffectProps): EffectResult {
  const firstEvent = createEvent('First, if the leftmost timeline scheme is green or yellow, copy it.')
  const left = passedTimeline[0]
  const leftColor = String(left?.color)
  const leftYellow = isYellow(left)
  const leftRank = String(left?.rank)
  const leftMessage = `The leftmost timeline scheme, ${leftRank}, is ${leftColor}.`
  const leftNonMessage = left == null ? 'The timeline is empty' : `The leftmost timeline scheme is ${leftRank}, is red.`
  const {
    effectAppointments: playAppointments,
    effectChoices: playChoices,
    effectDeck: playDeck,
    effectDiscard: playDiscard,
    effectGold: playGold,
    effectHand: playHand,
    effectSilver: playSilver
  } = copyEffect({
    appointments,
    choices,
    condition: leftYellow,
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
    effectHand: colorHand,
    effectSilver: colorSilver
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
    event: secondEvent,
    silver: playSilver
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
