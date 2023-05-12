import { SchemeEffectProps, EffectResult } from '../types'
import createEvent from '../create/event'
import getLowestRankScheme from '../get/lowestRankScheme'
import copyEffect from './copy'
import isGreenOrYellow from '../is/greenOrYellow'
import isYellow from '../is/yellow'
import createColorsEvent from '../create/event/colors'

export default function effectEight ({
  summons,
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
  resume,
  silver
}: SchemeEffectProps): EffectResult {
  const firstEvent = createEvent('First, you copy the lowest rank yellow scheme in play.')
  const yellowSchemes = playSchemes.filter(isYellow)
  const yellowScheme = getLowestRankScheme(yellowSchemes)
  const yellowRank = String(yellowScheme?.rank)

  const nonEvent = createColorsEvent({
    message: 'There are no yellow schemes in play.',
    schemes: playSchemes
  })
  const {
    effectSummons: playSummons,
    effectChoices: playChoices,
    effectDeck: playDeck,
    effectDiscard: playDiscard,
    effectGold: playGold,
    effectHand: playHand,
    effectSilver: playSilver
  } = copyEffect({
    summons,
    choices,
    deck,
    discard,
    dungeon,
    copiedByFirstEffect: true,
    gold,
    passedTimeline,
    hand,
    playerId,
    playSchemeRef,
    playSchemes,
    resume,
    scheme: yellowScheme,
    message: `The lowest rank yellow scheme in play is ${yellowRank}`,
    nonEvent,
    event: firstEvent,
    silver
  })
  if (resume !== true && playChoices.length > 0) {
    return {
      effectSummons: playSummons,
      effectChoices: playChoices,
      effectDeck: playDeck,
      effectDiscard: playDiscard,
      effectGold: playGold,
      effectHand: playHand,
      effectPlayerEvents: [firstEvent],
      effectSilver: playSilver
    }
  }
  const secondEvent = createEvent('Second, you copy the lowest rank green or yellow dungeon scheme.')
  const dungeonSchemes = dungeon.filter(scheme => isGreenOrYellow(scheme))
  const dungeonScheme = getLowestRankScheme(dungeonSchemes)
  const dungeonRank = String(dungeonScheme?.rank)
  const {
    effectSummons: dungeonSummons,
    effectChoices: dungeonChoices,
    effectDeck: dungeonDeck,
    effectDiscard: dungeonDiscard,
    effectGold: dungeonGold,
    effectHand: dungeonHand,
    effectSilver: dungeonSilver
  } = copyEffect({
    summons: playSummons,
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
    message: `The lowest rank green or yellow dungeon scheme is ${dungeonRank}`,
    nonMessage: 'There are no green or yellow dungeon schemes.',
    event: secondEvent,
    silver: playSilver
  })
  const playerEvents = resume === true ? [secondEvent] : [firstEvent, secondEvent]
  return {
    effectSummons: dungeonSummons,
    effectChoices: dungeonChoices,
    effectDeck: dungeonDeck,
    effectDiscard: dungeonDiscard,
    effectGold: dungeonGold,
    effectHand: dungeonHand,
    effectPlayerEvents: playerEvents,
    effectSilver: dungeonSilver
  }
}
