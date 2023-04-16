import createPrivelege from '../create/privelege'
import { SchemeEffectProps } from '../types'
import getHighestTime from '../get/highestTime'
import draw from '../draw'
import { createEvent } from '../create/event'
import { arrayUnion } from 'firelord'

export default function effectThree ({
  allPlayers,
  playerData,
  gameData,
  gameRef,
  hand,
  passedTimeline,
  playerRef,
  transaction
}: SchemeEffectProps): void {
  const discardPrivelege = createPrivelege(3)
  const bankDiscard = [...playerData.discard, ...discardPrivelege]
  const firstEvent = createEvent('First, you put 3 privelege on your discard.')
  const highestTime = getHighestTime(allPlayers)
  const timeEvent = createEvent(`The highest time in play is ${highestTime}.`)
  const {
    drawnDeck,
    drawnDiscard,
    drawEvents,
    drawnHand
  } = draw({
    deck: playerData.deck,
    discard: bankDiscard,
    hand,
    depth: highestTime
  })
  const secondChildren = [timeEvent, ...drawEvents]
  const secondEvent = createEvent('Second, you draw the highest time in play', secondChildren)
  transaction.update(playerRef, {
    hand: drawnHand,
    deck: drawnDeck,
    discard: drawnDiscard,
    history: arrayUnion(firstEvent, secondEvent)
  })
}
