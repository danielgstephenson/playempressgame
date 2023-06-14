import createEvent from './create/event'
import guardTime from './guard/time'
import getJoinedRanks from './get/joined/ranks'
import { PlayState } from './types'
import guardTimeEvent from './guard/timeEvent'
import playerSort from './sort/player'
import getGrammar from './get/grammar'
import guardDefined from './guard/defined'
import addEvent from './add/event'
import guardPlayScheme from './guard/playScheme'

export default function passTime ({ playState }: {
  playState: PlayState
}): PlayState {
  const playersLengthGrammar = getGrammar(playState.players.length)
  const totalTime = playState.players.reduce((total, player) => {
    const playScheme = guardPlayScheme(player)
    const time = guardTime(playScheme.rank)
    return total + time
  }, 0)
  const totalTimeGrammar = getGrammar(totalTime)
  const totalMessage = `The total time is ${totalTimeGrammar.spelled}`
  const timePasses = totalTime > playState.players.length
  if (timePasses) {
    const moreMessage = `${totalMessage}, more than the ${playersLengthGrammar.spelled} players`
    if (playState.game.timeline.length === 0) {
      const emptyMessage = `${moreMessage}, but the the timeline is empty because the game is ending.`
      addEvent(playState.game, emptyMessage)
      playState.players.forEach(player => {
        addEvent(player, emptyMessage)
      })
      return playState
    }
    const [passed, ...remaining] = playState.game.timeline
    const beforeTimeline = [...playState.game.timeline]
    const beforeJoined = getJoinedRanks(beforeTimeline)
    const beforeEvent = createEvent(`The timeline was ${beforeJoined}.`)
    playState.game.timeline = remaining
    const defined = guardDefined(passed, 'Passed scheme')
    const timeMessage = `${moreMessage}, so ${defined.rank} is removed from the timeline.`
    const observerEvent = createEvent(timeMessage)
    const afterTimeline = [...remaining]
    const afterJoined = getJoinedRanks(afterTimeline)
    const afterEvent = createEvent(`The timeline is now ${afterJoined}.`)
    playState.players.forEach(player => {
      const observerChild = guardTimeEvent({ player })
      observerEvent.events.push(observerChild)
      const playerEvent = createEvent(timeMessage)
      const privateChildren = playState
        .players
        .map(timePlayer => guardTimeEvent({
          player: timePlayer,
          privateId: player.id
        }))
      playerSort({ events: privateChildren, playerId: player.id })
      playerEvent.events = [...privateChildren, beforeEvent, afterEvent]
      player.events.push(playerEvent)
    })
    observerEvent.events.push(beforeEvent, afterEvent)
    playState.game.events.push(observerEvent)
    return playState
  }
  const timeResult = `not more than the ${playersLengthGrammar.spelled} players, so time does not pass.`
  const timeMessage = `${totalMessage}, ${timeResult}`
  const publicEvent = createEvent(timeMessage)
  playState.players.forEach(player => {
    const publicChild = guardTimeEvent({ player })
    publicEvent.events.push(publicChild)
    const privateEvent = createEvent(timeMessage)
    const privateEvents = playState
      .players
      .map(timePlayer => guardTimeEvent({
        player: timePlayer,
        privateId: player.id
      }))
    privateEvent.events.push(...privateEvents)
    player.events.push(privateEvent)
  })
  playState.game.events.push(publicEvent)
  return playState
}
