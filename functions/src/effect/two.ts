import { createEvent } from '../create/event'
import getLowestTime from '../get/lowestTime'
import revive from '../revive'
import { SchemeEffectProps, SchemeResult } from '../types'
import draw from '../draw'

export default function effectTwo ({
  allPlayers,
  playerResult,
  gameData,
  hand,
  passedTimeline
}: SchemeEffectProps): SchemeResult {
  const lowestTime = getLowestTime(allPlayers)
  const {
    revivedDiscard,
    revivedHand,
    reviveEvents
  } = revive({
    discard: playerResult.discard,
    hand,
    depth: lowestTime
  })
  const timeEvent = createEvent(`The lowest time in play is ${lowestTime}.`)
  const firstChildren = [timeEvent, ...reviveEvents]
  const firstEvent = createEvent('First, you revive the lowest time in play', firstChildren)
  const { drawnDeck, drawnHand, drawnDiscard, drawEvents } = draw({
    deck: playerResult.deck,
    discard: revivedDiscard,
    hand: revivedHand,
    depth: gameData.dungeon.length
  })
  const dungeonEvent = createEvent(`The are ${gameData.dungeon.length} schemes in the dungeon.`)
  const secondChildren = [dungeonEvent, ...drawEvents]
  const secondEvent = createEvent('Second, you draw the number of schemes in the dungeon', secondChildren)
  const playerChanges = {
    deck: drawnDeck,
    discard: drawnDiscard
  }

  return {
    hand: drawnHand,
    playerEvents: [firstEvent, secondEvent],
    playerChanges
  }
}
