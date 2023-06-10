import { HistoryEvent, PlayState } from '../../../types'
import getScore from '../../../get/score'
import createEvent from '../../../create/event'
import addEvent from '../../event'

export default function addPlayerWinEvents ({
  observerEvent,
  playerEvents,
  playState
}: {
  observerEvent: HistoryEvent
  playerEvents: HistoryEvent[]
  playState: PlayState
}): void {
  playState.players.forEach(player => {
    const score = getScore(player)
    playerEvents.forEach(playerEvent => {
      const has = `${player.displayName} has`
      const goldEvent = createEvent(`${has} ${player.gold} gold.`)
      const silverEvent = createEvent(`${has} ${player.silver} silver.`)
      const handTotal = player.hand.reduce((total, scheme) => {
        return total + scheme.rank
      }, 0)
      const handChildren = player.hand.map(scheme => {
        return createEvent(String(scheme.rank))
      })
      const handEvent = createEvent(`The total rank in ${player.displayName}'s hand is ${handTotal}.`, handChildren)
      const publicChildren = [goldEvent, silverEvent, handEvent]
      const publicScoreMessage = `${player.displayName}'s score is ${score}`
      addEvent(observerEvent, publicScoreMessage, publicChildren)
      if (playerEvent.playerId === player.id) {
        const goldEvent = createEvent(`You have ${player.gold} gold.`)
        const silverEvent = createEvent(`You have ${player.silver} silver.`)
        const handEvent = createEvent(`The total rank in your hand is ${handTotal}.`, handChildren)
        const privateScoreMessage = `Your score is ${score}`
        addEvent(playerEvent, privateScoreMessage, [goldEvent, silverEvent, handEvent])
      } else {
        addEvent(playerEvent, publicScoreMessage, publicChildren)
      }
    })
  })
}
