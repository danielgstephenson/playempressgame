import { SchemeEffectProps, EffectResult } from '../types'
import createEvent from '../create/event'
import copyEffect from './copy'
import getTopScheme from '../get/topScheme'
import isRed from '../is/red'
import isGreen from '../is/green'

export default function effectFifteen ({
  summons,
  choices,
  deck,
  discard,
  dungeon,
  gold,
  passedTimeline,
  hand,
  playerId,
  playSchemes,
  playSchemeRef,
  silver
}: SchemeEffectProps): EffectResult {
  const firstEvent = createEvent('First, if your top discard scheme is red, copy the leftmost green timeline scheme.')
  const topScheme = getTopScheme(discard)
  const topRank = String(topScheme?.rank)
  const discardRed = isRed(topScheme)
  const green = passedTimeline.filter(isGreen)
  const left = green[0]
  const leftRank = String(left?.rank)
  const leftMessage = `The leftmost green timeline scheme is ${leftRank}.`
  const leftNonMessage = discardRed
    ? 'There are no green timeline schemes.'
    : discard.length === 0
      ? 'Your discard is empty.'
      : `Your top discard scheme, ${topRank}, is not red.`
  const {
    effectSummons: leftSummons,
    effectChoices: leftChoices,
    effectDeck: leftDeck,
    effectDiscard: leftDiscard,
    effectGold: leftGold,
    effectHand: leftHand,
    effectSilver: leftSilver
  } = copyEffect({
    summons,
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
    playSchemeRef,
    scheme: left,
    message: leftMessage,
    nonMessage: leftNonMessage,
    event: firstEvent,
    silver
  })
  const secondEvent = createEvent('Otherwise, copy your top discard scheme.')
  const topMessage = `Your top discard scheme is ${topRank}.`
  const topNonMessage = discardRed
    ? `Your top discard scheme, ${topRank}, is red.`
    : 'Your discard is empty.'
  const {
    effectSummons: colorSummons,
    effectChoices: colorChoices,
    effectDeck: colorDeck,
    effectDiscard: colorDiscard,
    effectGold: colorGold,
    effectHand: colorHand,
    effectSilver: colorSilver
  } = copyEffect({
    summons: leftSummons,
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
    playSchemeRef,
    scheme: topScheme,
    message: topMessage,
    nonMessage: topNonMessage,
    event: secondEvent,
    silver: leftSilver
  })
  return {
    effectSummons: colorSummons,
    effectChoices: colorChoices,
    effectDeck: colorDeck,
    effectDiscard: colorDiscard,
    effectGold: colorGold,
    effectHand: colorHand,
    effectPlayerEvents: [firstEvent, secondEvent],
    effectSilver: colorSilver
  }
}
