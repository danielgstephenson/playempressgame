import { SchemeEffectProps, EffectResult } from '../types'
import copyEffect from './copy'
import getHighestRankScheme from '../get/highestRankScheme'
import createEvent from '../create/event'
import isYellow from '../is/yellow'
import createColorsEvent from '../create/colorsEvent'

export default function effectTen ({
  appointments,
  choices,
  deck,
  discard,
  dungeon,
  // red effects are always first
  gold,
  passedTimeline,
  hand,
  playerId,
  playSchemeRef,
  playSchemes,
  silver
}: SchemeEffectProps): EffectResult {
  const firstEvent = createEvent('First, if your top discard scheme is yellow, copy it.')
  const topDiscard = discard[0]
  const topDiscardRank = String(topDiscard?.rank)
  const topDiscardColor = String(topDiscard?.color)
  const topYellow = isYellow(topDiscard)
  const nonMessage = topDiscard == null
    ? 'Your discard is empty'
    : `Your top discard scheme, ${topDiscardRank}, is ${topDiscardColor}.`
  const {
    effectSummons: discardAppointments,
    effectChoices: discardChoices,
    effectDeck: discardDeck,
    effectDiscard: discardDiscard,
    effectGold: discardGold,
    effectHand: discardHand,
    effectSilver: discardSilver
  } = copyEffect({
    appointments,
    choices,
    condition: topYellow,
    deck,
    discard,
    dungeon,
    first: true,
    gold,
    passedTimeline,
    hand,
    playerId,
    playSchemeRef,
    playSchemes,
    scheme: topDiscard,
    message: `Your top discard scheme, ${topDiscardRank}, is yellow.`,
    nonMessage,
    event: firstEvent,
    silver
  })
  const secondEvent = createEvent('Second, you copy the highest rank yellow scheme in play.')
  const yellowSchemes = playSchemes.filter(scheme => isYellow(scheme))
  const playScheme = getHighestRankScheme(yellowSchemes)
  const playRank = String(playScheme?.rank)
  console.log('playSchemes', playSchemes)
  const playNonEvent = createColorsEvent({
    message: 'There are no yellow schemes in play.',
    schemes: playSchemes
  })
  console.log('playNonEvent', playNonEvent)
  const {
    effectSummons: playAppointments,
    effectChoices: playChoices,
    effectDeck: playDeck,
    effectDiscard: playDiscard,
    effectGold: playGol,
    effectHand: playHand,
    effectSilver: playSilver
  } = copyEffect({
    appointments: discardAppointments,
    choices: discardChoices,
    deck: discardDeck,
    discard: discardDiscard,
    dungeon,
    gold: discardGold,
    passedTimeline,
    hand: discardHand,
    playerId,
    playSchemeRef,
    playSchemes,
    scheme: playScheme,
    message: `The highest rank yellow scheme in play is ${playRank}.`,
    nonEvent: playNonEvent,
    event: secondEvent,
    silver: discardSilver
  })
  return {
    effectSummons: playAppointments,
    effectChoices: playChoices,
    effectDeck: playDeck,
    effectDiscard: playDiscard,
    effectGold: playGol,
    effectHand: playHand,
    effectPlayerEvents: [firstEvent, secondEvent],
    effectSilver: playSilver
  }
}
