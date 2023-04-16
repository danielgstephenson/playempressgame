import { SchemeEffectProps } from '../types'
import { createEvent } from '../create/event'
import { arrayUnion } from 'firelord'
import getHighestTime from '../get/highestTime'
import revive from '../revive'
import draw from '../draw'

export default function effectSix ({
  allPlayers,
  playerData,
  gameData,
  gameRef,
  hand,
  passedTimeline,
  playerRef,
  transaction
}: SchemeEffectProps): void {
  const highestTime = getHighestTime(allPlayers)
  const timeEvent = createEvent(`The highest time in play is ${highestTime}.`)
  const { revivedDiscard, revivedHand, reviveEvents } = revive({
    discard: playerData.discard,
    hand,
    depth: highestTime
  })
  const firstChildren = [timeEvent, ...reviveEvents]
  const firstEvent = createEvent('First, you revive the highest time in play', firstChildren)
  const dungeonRanks = gameData.dungeon.map(scheme => scheme.rank)
  const lowestDungeon = Math.min(...dungeonRanks)
  const dungeonEvent = createEvent(`The lowest rank in the dungeon is ${lowestDungeon}.`)
  const { drawnDeck, drawnDiscard, drawnHand, drawEvents } = draw({
    deck: playerData.deck,
    discard: revivedDiscard,
    hand: revivedHand,
    depth: lowestDungeon
  })
  const secondChildren = [dungeonEvent, ...drawEvents]
  const secondEvent = createEvent('Second, you draw the lowest rank in the dungeon', secondChildren)
  transaction.update(playerRef, {
    hand: drawnHand,
    deck: drawnDeck,
    discard: drawnDiscard,
    history: arrayUnion(firstEvent, secondEvent)
  })
}
