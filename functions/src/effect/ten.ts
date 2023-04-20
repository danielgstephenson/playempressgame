import { SchemeEffectProps, EffectResult } from '../types'
import copyEffect from './copy'
import getHighestRankScheme from '../get/highestRankScheme'
import createEvent from '../create/event'
import isGreen from '../is/green'
import isYellow from '../is/yellow'

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
  playSchemes,
  silver
}: SchemeEffectProps): EffectResult {
  const firstEvent = createEvent('First, you copy the leftmost yellow timeline scheme.')
  const yellowSchemes = passedTimeline.filter(isYellow)
  const yellowScheme = yellowSchemes[0]
  const yellowRank = String(yellowScheme?.rank)
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
    event: firstEvent,
    silver
  })
  const secondEvent = createEvent('Second, you copy the highest rank green dungeon scheme.')
  const dungeonSchemes = dungeon.filter(scheme => isGreen(scheme))
  const dungeonScheme = getHighestRankScheme(dungeonSchemes)
  const dungeonRank = String(dungeonScheme?.rank)
  const {
    effectAppointments: dungeonAppointments,
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
    playSchemes,
    scheme: dungeonScheme,
    message: `The highest rank green dungeon scheme is ${dungeonRank}.`,
    nonMessage: 'There are no green or yellow dungeon schemes.',
    event: secondEvent,
    silver: playSilver
  })
  return {
    effectAppointments: dungeonAppointments,
    effectChoices: dungeonChoices,
    effectDeck: dungeonDeck,
    effectDiscard: dungeonDiscard,
    effectGold: dungeonGold,
    effectHand: dungeonHand,
    effectPlayerEvents: [firstEvent, secondEvent],
    effectSilver: dungeonSilver
  }
}
