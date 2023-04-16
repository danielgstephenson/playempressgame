import drawMultiple from '../draw/multiple'
import { SchemeEffectProps } from '../types'
import { createEvent } from '../create/event'
import { arrayUnion } from 'firelord'
import getHighestTime from '../get/highestTime'
import revive from '../revive'

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
  const secondEvent = createEvent('Second, draw the lowest rank in the dungeon')
  const dungeonRanks = gameData.dungeon.map(scheme => scheme.rank)
  const lowestDungeon = Math.min(...dungeonRanks)
  const { drawnDeck, drawnDiscard, drawnHand } = drawMultiple({
    deck: playerData.deck,
    discard: revivedDiscard,
    hand: revivedHand,
    depth: lowestDungeon
  })
  transaction.update(playerRef, {
    hand: drawnHand,
    deck: drawnDeck,
    discard: drawnDiscard,
    history: arrayUnion(firstEvent, secondEvent)
  })
}
