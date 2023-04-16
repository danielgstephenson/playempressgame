import drawMultiple from '../draw/multiple'
import { SchemeEffectProps } from '../types'
import reviveMultiple from '../revive/multiple'
import { createEvent } from '../create/event'
import { arrayUnion } from 'firelord'
import getHighestTime from '../get/highestTime'

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
  const firstEvent = createEvent('First, you revive the highest time in play')
  const highestTime = getHighestTime(allPlayers)
  const { revivedDiscard, revivedList } = reviveMultiple({
    discard: playerData.discard,
    reviveList: [],
    depth: highestTime
  })
  const secondEvent = createEvent('Second, draw the lowest rank in the dungeon')
  const dungeonRanks = gameData.dungeon.map(scheme => scheme.rank)
  const lowestDungeon = Math.min(...dungeonRanks)
  const { drawnDeck, drawnDiscard, drawnList } = drawMultiple({
    deck: playerData.deck,
    discard: revivedDiscard,
    drawList: revivedList,
    depth: lowestDungeon
  })
  const drawnHand = [...hand, ...drawnList]
  transaction.update(playerRef, {
    hand: drawnHand,
    deck: drawnDeck,
    discard: drawnDiscard,
    history: arrayUnion(firstEvent, secondEvent)
  })
}
