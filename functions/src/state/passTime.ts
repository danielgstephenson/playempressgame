import createEvent from '../create/event'
import guardTime from '../guard/time'
import getJoinedRanks from '../get/joined/ranks'
import { PlayState } from '../types'
import guardPlayHandScheme from '../guard/playHandScheme'
import guardTimeEvent from '../guard/timeEvent'
import playerSort from '../sort/player'

export default function passTimeState ({ playState }: {
  playState: PlayState
}): PlayState {
  const totalTime = playState.players.reduce((total, player) => {
    const playScheme = guardPlayHandScheme(player)
    const time = guardTime(playScheme.rank)
    return total + time
  }, 0)
  const totalMessage = `The total time is ${totalTime}`
  const timePasses = totalTime > playState.players.length
  if (timePasses) {
    const [passed, ...remaining] = playState.game.timeline
    playState.game.timeline = remaining
    const passedRank = String(passed?.rank)
    const timeResult = `more than the ${playState.players.length} players, so ${passedRank} is removed from the timeline.`
    const timeMessage = `${totalMessage}, ${timeResult}`
    const observerEvent = createEvent(timeMessage)
    const beforeJoined = getJoinedRanks(playState.game.timeline)
    const beforeEvent = createEvent(`The timeline was ${beforeJoined}.`)
    const afterJoined = getJoinedRanks(remaining)
    const afterEvent = createEvent(`The timeline is now ${afterJoined}.`)
    playState.players.forEach(player => {
      const observerChild = guardTimeEvent({ player })
      observerEvent.children.push(observerChild)
      const playerEvent = createEvent(timeMessage)
      const privateChildren = playState
        .players
        .map(timePlayer => guardTimeEvent({
          player: timePlayer,
          privateId: player.id
        }))
      playerSort({ events: privateChildren, player })
      playerEvent.children = [...privateChildren, beforeEvent, afterEvent]
      player.history.push(playerEvent)
    })
    observerEvent.children.push(beforeEvent, afterEvent)
    playState.game.history.push(observerEvent)
    return playState
  }
  const timeResult = `not more than the ${playState.players.length} players, so time does not pass.`
  const timeMessage = `${totalMessage}, ${timeResult}`
  const publicEvent = createEvent(timeMessage)
  playState.players.forEach(player => {
    const publicChild = guardTimeEvent({ player })
    publicEvent.children.push(publicChild)
    const privateEvent = createEvent(timeMessage)
    const privateEvents = playState
      .players
      .map(timePlayer => guardTimeEvent({
        player: timePlayer,
        privateId: player.id
      }))
    privateEvent.children.push(...privateEvents)
    player.history.push(privateEvent)
  })
  playState.game.history.push(publicEvent)
  return playState
}
