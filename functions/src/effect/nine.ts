import { SchemeEffectProps, EffectResult } from '../types'
import createEvent from '../create/event'
import copyEffect from './copy'
import getHighestRankScheme from '../get/highestRankScheme'
import isGreen from '../is/green'
import isYellow from '../is/yellow'
import createColorsEvent from '../create/colorsEvent'

export default function effectNine ({
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
  const firstEvent = createEvent('First, you copy the leftmost yellow timeline scheme.')
  const yellowSchemes = passedTimeline.filter(isYellow)
  const yellowScheme = yellowSchemes[0]
  const yellowRank = String(yellowScheme?.rank)
  const nonEvent = createColorsEvent({
    message: 'There are no yellow timeline schemes.',
    schemes: passedTimeline
  })
  const {
    effectSummons: playAppointments,
    effectChoices: playChoices,
    effectDeck: playDeck,
    effectDiscard: playDiscard,
    effectGold: playGold,
    effectHand: playHand,
    effectSilver: playSilver
  } = copyEffect({
    appointments,
    choices,
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
    scheme: yellowScheme,
    message: `The leftmost yellow timeline scheme is ${yellowRank}`,
    nonEvent,
    event: firstEvent,
    silver
  })
  const secondEvent = createEvent('Second, you copy the highest rank green dungeon scheme.')
  const dungeonSchemes = dungeon.filter(scheme => isGreen(scheme))
  const dungeonScheme = getHighestRankScheme(dungeonSchemes)
  const dungeonRank = String(dungeonScheme?.rank)
  const {
    effectSummons: dungeonAppointments,
    effectChoices: dungeonChoices,
    effectDeck: dungeonDeck,
    effectDiscard: dungeonDiscard,
    effectGold: dungeonGold,
    effectHand: dungeonHand,
    effectSilver: dungeonSilver
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
    playSchemeRef,
    playSchemes,
    scheme: dungeonScheme,
    message: `The highest rank green dungeon scheme is ${dungeonRank}`,
    nonMessage: 'There are no green dungeon schemes.',
    event: secondEvent,
    silver: playSilver
  })
  return {
    effectSummons: dungeonAppointments,
    effectChoices: dungeonChoices,
    effectDeck: dungeonDeck,
    effectDiscard: dungeonDiscard,
    effectGold: dungeonGold,
    effectHand: dungeonHand,
    effectPlayerEvents: [firstEvent, secondEvent],
    effectSilver: dungeonSilver
  }
}
