import { SchemeEffectProps, SchemeResult } from '../types'
import { createEvent } from '../create/event'
import getHighestTime from '../get/highestTime'
import revive from '../revive'
import draw from '../draw'

export default function effectSix ({
  allPlayers,
  playerResult,
  gameData,
  hand,
  passedTimeline
}: SchemeEffectProps): SchemeResult {
  const highestTime = getHighestTime(allPlayers)
  const timeEvent = createEvent(`The highest time in play is ${highestTime}.`)
  const { revivedDiscard, revivedHand, reviveEvents } = revive({
    discard: playerResult.discard,
    hand,
    depth: highestTime
  })
  const firstChildren = [timeEvent, ...reviveEvents]
  const firstEvent = createEvent('First, you revive the highest time in play', firstChildren)
  const dungeonRanks = gameData.dungeon.map(scheme => scheme.rank)
  const lowestDungeon = Math.min(...dungeonRanks)
  const dungeonEvent = createEvent(`The lowest rank in the dungeon is ${lowestDungeon}.`)
  const { drawnDeck, drawnDiscard, drawnHand, drawEvents } = draw({
    deck: playerResult.deck,
    discard: revivedDiscard,
    hand: revivedHand,
    depth: lowestDungeon
  })
  const secondChildren = [dungeonEvent, ...drawEvents]
  const secondEvent = createEvent('Second, you draw the lowest rank in the dungeon', secondChildren)
  return {
    hand: drawnHand,
    playerChanges: {
      deck: drawnDeck,
      discard: drawnDiscard
    },
    playerEvents: [firstEvent, secondEvent]
  }
}
