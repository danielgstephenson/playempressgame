import { SchemeEffectProps, EffectResult } from '../types'
import createEvent from '../create/event'
import earn from '../earn'
import addEvent from '../addEvent'

export default function effectTwentyOne ({
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
  const firstEvent = createEvent("First, pay five times the left timeline scheme's time in gold.")
  const left = passedTimeline[0]
  const timelineEmpty = left == null
  const leftRank = String(left?.rank)
  let leftGold = gold
  let leftSilver = silver
  if (timelineEmpty) {
    addEvent(firstEvent, 'The timeline is empty.')
  } else {
    addEvent(firstEvent, `The leftmost timeline scheme is ${leftRank} with ${left.time} time.`)
    if (left.time > 0) {
      const leftFive = left.time * 5
      addEvent(firstEvent, `Five times ${left.time} is ${leftFive}.`)
      if (silver >= 0) {
        if (leftFive >= silver) {
          addEvent(firstEvent, `You pay ${silver} silver, all you have.`)
          leftSilver = 0
          if (leftFive > silver) {
            const remaining = leftFive - silver
            if (gold === 0) {
              addEvent(firstEvent, `You have no gold to pay the remaining ${remaining}.`)
              leftGold = 0
            } else if (remaining >= gold) {
              addEvent(firstEvent, `You pay ${gold} gold, all you have.`)
              leftGold = 0
            } else {
              addEvent(firstEvent, `You pay ${remaining} gold.`)
              leftGold = gold - remaining
            }
          }
        } else {
          addEvent(firstEvent, `You pay ${leftFive} silver.`)
          leftSilver = silver - leftFive
        }
      } else {
        if (gold === 0) {
          addEvent(firstEvent, 'You have no gold to pay.')
          leftGold = 0
        } else if (leftFive >= gold) {
          addEvent(firstEvent, `You pay ${gold} gold, all you have.`)
          leftGold = 0
        } else {
          addEvent(firstEvent, `You pay ${leftFive} gold.`)
          leftGold = gold - leftFive
        }
      }
    }
  }
  const secondEvent = createEvent("Second, you earn twice the left timeline scheme's rank.")
  const twiceRank = left == null ? left : left?.rank * 2
  const { gold: secondGold, silver: secondSilver } = earn({
    baseGold: leftGold,
    baseSilver: leftSilver,
    bonus: twiceRank,
    event: secondEvent,
    message: `The leftmost timeline scheme is ${leftRank}.`,
    nonMessage: 'The timeline is empty.'
  })
  return {
    effectSummons: appointments,
    effectChoices: choices,
    effectDeck: deck,
    effectDiscard: discard,
    effectGold: secondGold,
    effectHand: hand,
    effectPlayerEvents: [firstEvent, secondEvent],
    effectSilver: secondSilver
  }
}
