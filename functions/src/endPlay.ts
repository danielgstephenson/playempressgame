import { Transaction } from 'firelord'
import createEvent from './create/event'
import getJoined from './get/joined'
import guardFirst from './guard/first'
import guardHighestRankPlayScheme from './guard/highestRankPlayScheme'
import guardPlayScheme from './guard/playScheme'
import setPlayState from './setPlayState'
import { PlayState } from './types'
import addBroadcastEvent from './add/event/broadcast'

export default function endPlay ({
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
    const privateMessage = 'The threat on your 8 activates, so you put on your discard'
    if (highPlayers.length === 1) {
      const highPlayer = guardFirst(highPlayers, 'High player')
      const suffix = 'instead of summoning it to the court.'
      const privateEvent = createEvent(
        `${privateMessage} ${suffix}`
      )
      highPlayer.history.push(privateEvent)
      addBroadcastEvent({
        players: notHighPlayers,
        game: playState.game,
        message: `The threat on ${highPlayer.displayName}'s 8 activates, so they put it on their discard instead of summoning it to the court.`
      })
    } else {
      const suffix = 'instead of imprisoning them in the dungeon.'
      const privateEvent = createEvent(
        `${privateMessage} ${suffix}`
      )
      highPlayers.forEach(highPlayer => {
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
    return setPlayState({ playState, transaction })
  }
  const eightPlayers = playState
    .players
    .filter(player => player.playScheme?.rank === 8)
  const child = createEvent(`The highest rank scheme in play is ${highestPlayScheme.rank}, not 8.`)
  if (eightPlayers.length === 1) {
    const eightPlayer = guardFirst(eightPlayers, 'Eight player')
    const privateMessage = 'The threat on your 8 does not activate.'
    const privateEvent = createEvent(privateMessage)
    privateEvent.children.push(child)
    eightPlayer.history.push(privateEvent)
    const otherPlayers = playState
      .players
      .filter(player => player.id !== eightPlayer.id)
    const publicEvent = addBroadcastEvent({
      players: otherPlayers,
      game: playState.game,
      message: `The threat on ${eightPlayer.displayName}'s 8 does not activate.`
    })
    publicEvent.children.push(child)
  } else if (eightPlayers.length > 0) {
    eightPlayers.forEach(eightPlayer => {
      const otherEightPlayers = eightPlayers
        .filter(player => player.id !== eightPlayer.id)
      const otherDisplayNames = otherEightPlayers.map(p => p.displayName)
      const displayNames = ['You', ...otherDisplayNames]
      const joined = getJoined(displayNames)
      const message = `The threat on ${joined}'s 8s does not activate.`
      const event = createEvent(message)
      eightPlayer.history.push(event)
      event.children.push(child)
    })
    const displayNames = eightPlayers.map(p => p.displayName)
    const joined = getJoined(displayNames)
    const notEightPlayers = playState
      .players
      .filter(player => player.playScheme?.rank !== 8)
    const event = addBroadcastEvent({
      players: notEightPlayers,
      game: playState.game,
      message: `The threat on the 8s played by ${joined} does not activate.`
    })
    event.children.push(child)
  }

  if (highPlayers.length === 1) {
    const highPlayer = guardFirst(highPlayers, 'High player')
    playState.game.court.push(guardPlayScheme(highPlayer))
    highPlayer.playScheme = undefined
    const privateSummonMessage = `Your ${highestPlayScheme.rank} is summoned to the court.`
    const privateSummonEvent = createEvent(privateSummonMessage)
    highPlayer.history.push(privateSummonEvent)
    addBroadcastEvent({
      players: notHighPlayers,
      game: playState.game,
      message: `${highPlayer.displayName}'s ${highestPlayScheme.rank} is summoned to the court.`
    })
  } else {
    highPlayers.forEach(highPlayer => {
      const otherHighPlayers = highPlayers.filter(player => player.id !== highPlayer.id)
      const otherHighDisplayNames = otherHighPlayers.map(p => p.displayName)
      const displayNames = ['You', ...otherHighDisplayNames]
      const joinedDisplayNames = getJoined(displayNames)
      const privateEvent = createEvent(`${joinedDisplayNames} imprison your ${highestPlayScheme.rank}s in the dungeon.`)
      highPlayer.history.push(privateEvent)
      playState.game.dungeon.push(guardPlayScheme(highPlayer))
      highPlayer.playScheme = undefined
    })
    const highDisplayNames = highPlayers.map(p => p.displayName)
    const joinedHighDisplayNames = getJoined(highDisplayNames)
    addBroadcastEvent({
      players: notHighPlayers,
      game: playState.game,
      message: `The ${highestPlayScheme.rank}s played by ${joinedHighDisplayNames} are summoned to the court.`
    })
  }
  setPlayState({ playState, transaction })
}
