import { Transaction } from 'firelord'
import createEvent from './create/event'
import getJoined from './get/joined'
import guardFirst from './guard/first'
import guardHighestRankPlayScheme from './guard/highestRankPlayScheme'
import guardPlayScheme from './guard/playScheme'
import setPlayState from './setPlayState'
import { PlayState } from './types'
import addBroadcastEvent from './add/event/broadcast'
import copyEffects from './effects/copy'
import addPublicEvents from './add/events/public'
import getJoinedPossessive from './get/joined/possessive'
import endPlay from './endPlay'

export default function endThreats ({
  playState,
  transaction
}: {
  playState: PlayState
  transaction: Transaction
}): void {
  const highestPlayScheme = guardHighestRankPlayScheme(playState.players)
  addBroadcastEvent({
    players: playState.players,
    game: playState.game,
    message: `The highest rank scheme in play is ${highestPlayScheme.rank}.`
  })
  const highPlayers = playState
    .players
    .filter(player => player.playScheme?.rank === highestPlayScheme.rank)
  const notHighPlayers = playState
    .players
    .filter(player => player.playScheme?.rank !== highestPlayScheme.rank)
  if (highestPlayScheme.rank === 8) {
    if (highPlayers.length === 1) {
      const highPlayer = guardFirst(highPlayers, 'High player')
      const privateMessage = 'The threat on your 8 activates, so you put it on your discard instead of summoning it to the court.'
      const privateEvent = createEvent(privateMessage)
      highPlayer.history.push(privateEvent)
      addBroadcastEvent({
        players: notHighPlayers,
        game: playState.game,
        message: `The threat on ${highPlayer.displayName}'s 8 activates, so they put it on their discard instead of summoning it to the court.`
      })
    } else {
      highPlayers.forEach(highPlayer => {
        const otherHighPlayers = highPlayers.filter(player => player.id !== highPlayer.id)
        const otherHighDisplayNames = otherHighPlayers.map(p => p.displayName)
        const displayNames = ['You', ...otherHighDisplayNames]
        const joined = getJoinedPossessive(displayNames)
        const privateMessage = `The threat on ${joined}'s 8s activate, so you put them on your discards instead of imprisoning them in the dungeon.`
        const privateEvent = createEvent(privateMessage)
        highPlayer.history.push(privateEvent)
      })
      const highDisplayNames = highPlayers.map(p => p.displayName)
      const joinedHighDisplayNames = getJoined(highDisplayNames)
      addBroadcastEvent({
        players: notHighPlayers,
        game: playState.game,
        message: `The threat on ${joinedHighDisplayNames}'s 8s activate, so they put them on their discards instead of imprisoning them in the dungeon.`
      })
    }
    highPlayers.forEach(highPlayer => {
      const playScheme = guardPlayScheme(highPlayer)
      highPlayer.discard = [...highPlayer.discard, playScheme]
      highPlayer.playScheme = undefined
    })
    return setPlayState({ playState, transaction })
  }
  if (highestPlayScheme.rank === 15) {
    if (highPlayers.length === 1) {
      const privateMessage = 'The threat on your 15 activates, so you copy it.'
      const highPlayer = guardFirst(highPlayers, 'High player')
      const privateEvent = createEvent(privateMessage)
      highPlayer.history.push(privateEvent)
      const publicEvents = addPublicEvents({
        effectPlayer: highPlayer,
        message: `The threat on ${highPlayer.displayName}'s 15 activates, so they copy it.`,
        playState
      })
      const playScheme = guardPlayScheme(highPlayer)
      const choices = copyEffects({
        copiedByFirstEffect: true,
        effectPlayer: highPlayer,
        effectScheme: playScheme,
        playState,
        privateEvent,
        publicEvents,
        resume: false,
        threat: playScheme
      })
      if (choices.length > 0) {
        return setPlayState({ playState, transaction })
      }
    }
  }
  endPlay({ playState, transaction })
}
