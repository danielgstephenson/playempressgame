import { Transaction } from 'firelord'
import createEvent from './create/event'
import getJoined from './get/joined'
import guardFirst from './guard/first'
import guardHighestRankPlayScheme from './guard/highestRankPlayScheme'
import setPlayState from './setPlayState'
import { PlayState } from './types'
import addBroadcastEvent from './add/event/broadcast'
import addEvent from './add/event'
import addPublicEvents from './add/events/public'
import copyEffects from './effects/copy'
import getJoinedPossessive from './get/joined/possessive'
import guardPlayScheme from './guard/playScheme'
import drawUpToThree from './drawUpToThree'
import addPublicEvent from './add/event/public'

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
    message: `The highest rank in play is ${highestPlayScheme.rank}.`
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
      const privateMessage = 'Your 8 is the highest rank in play, so you carry out its threat.'
      const privateEvent = createEvent(privateMessage)
      highPlayer.events.push(privateEvent)
      const privateChildMessage = 'You put your 8 on your discard instead of summoning it to the court.'
      addEvent(privateEvent, privateChildMessage)
      const broadcastEvent = addBroadcastEvent({
        players: notHighPlayers,
        game: playState.game,
        message: `${highPlayer.displayName}'s 8 is the highest rank in play, so they carry out its threat.`
      })
      const publicChildMessage = `${highPlayer.displayName} puts their 8 on their discard instead of summoning it to the court.`
      addEvent(broadcastEvent, publicChildMessage)
    } else {
      highPlayers.forEach(highPlayer => {
        const otherHighPlayers = highPlayers.filter(player => player.id !== highPlayer.id)
        const otherHighDisplayNames = otherHighPlayers.map(p => p.displayName)
        const displayNames = ['You', ...otherHighDisplayNames]
        const joinedPossessive = getJoinedPossessive(displayNames)
        const privateMessage = `${joinedPossessive} 8s are the highest rank in play, so you carry out your threats.`
        const privateEvent = createEvent(privateMessage)
        highPlayer.events.push(privateEvent)
        const joined = getJoined(displayNames)
        const privateChildMessage = `${joined} put your 8s on your discards instead of imprisoning them in the dungeon.`
        addEvent(privateEvent, privateChildMessage)
      })
      const highDisplayNames = highPlayers.map(p => p.displayName)
      const joinedHighDisplayNamesPossessive = getJoinedPossessive(highDisplayNames)
      const broadcastEvent = addBroadcastEvent({
        players: notHighPlayers,
        game: playState.game,
        message: `${joinedHighDisplayNamesPossessive} 8s are the highest rank in play, so they carry out their threats.`
      })
      const joinedHighDisplayNames = getJoined(highDisplayNames)
      const childMessage = `${joinedHighDisplayNames} put their 8s on their discards instead of imprisoning them in the dungeon.`
      addEvent(broadcastEvent, childMessage)
    }
    highPlayers.forEach(highPlayer => {
      const playScheme = guardPlayScheme(highPlayer)
      highPlayer.discard = [...highPlayer.discard, playScheme]
      highPlayer.playScheme = undefined
    })
    return drawUpToThree({ playState, transaction })
  } else {
    const eightPlayers = playState
      .players
      .filter(player => player.playScheme?.rank === 8)
    const eightChild = createEvent(`The highest rank scheme in play is ${highestPlayScheme.rank}, not 8.`)
    if (eightPlayers.length === 1) {
      const eightPlayer = guardFirst(eightPlayers, 'Eight player')
      const privateMessage = 'You do not carry out the threat on your 8.'
      const privateEvent = createEvent(privateMessage)
      privateEvent.events.push(eightChild)
      eightPlayer.events.push(privateEvent)
      const otherPlayers = playState
        .players
        .filter(player => player.id !== eightPlayer.id)
      const publicEvent = addBroadcastEvent({
        players: otherPlayers,
        game: playState.game,
        message: `${eightPlayer.displayName} does not carry out the threat on their 8.`
      })
      publicEvent.events.push(eightChild)
    } else if (eightPlayers.length > 0) {
      eightPlayers.forEach(eightPlayer => {
        const otherEightPlayers = eightPlayers
          .filter(player => player.id !== eightPlayer.id)
        const otherDisplayNames = otherEightPlayers.map(p => p.displayName)
        const displayNames = ['You', ...otherDisplayNames]
        const joined = getJoined(displayNames)
        const message = `${joined} do not carry out the threats on their 8s.`
        const event = createEvent(message)
        eightPlayer.events.push(event)
        event.events.push(eightChild)
      })
      const displayNames = eightPlayers.map(p => p.displayName)
      const joined = getJoinedPossessive(displayNames)
      const notEightPlayers = playState
        .players
        .filter(player => player.playScheme?.rank !== 8)
      const event = addBroadcastEvent({
        players: notEightPlayers,
        game: playState.game,
        message: `${joined} do not carry out the threat on their 8s.`
      })
      event.events.push(eightChild)
    }
  }
  if (highPlayers.length === 1) {
    const highPlayer = guardFirst(highPlayers, 'High player')
    playState.game.court.push(guardPlayScheme(highPlayer))
    if (highestPlayScheme.rank !== 15) {
      highPlayer.playScheme = undefined
      const privateSummonMessage = `Your ${highestPlayScheme.rank} is summoned to the court.`
      const privateSummonEvent = createEvent(privateSummonMessage)
      highPlayer.events.push(privateSummonEvent)
      addBroadcastEvent({
        players: notHighPlayers,
        game: playState.game,
        message: `${highPlayer.displayName}'s ${highestPlayScheme.rank} is summoned to the court.`
      })
    } else {
      const privateMessage = 'Your 15 is summoned to the court, so you carry out its threat.'
      const privateEvent = createEvent(privateMessage)
      highPlayer.events.push(privateEvent)
      addEvent(privateEvent, 'You copy your 15.')
      const publicEvents = addPublicEvents({
        effectPlayer: highPlayer,
        message: `${highPlayer.displayName}'s 15 is summoned to the court, so they carry out its threat.`,
        playState
      })
      addPublicEvent(publicEvents, `${highPlayer.displayName} copies their 15.`)
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
      highPlayer.playScheme = undefined
      if (choices.length > 0) {
        return setPlayState({ playState, transaction })
      }
    }
  } else {
    highPlayers.forEach(highPlayer => {
      const otherHighPlayers = highPlayers.filter(player => player.id !== highPlayer.id)
      const otherHighDisplayNames = otherHighPlayers.map(p => p.displayName)
      const displayNames = ['You', ...otherHighDisplayNames]
      const joinedDisplayNames = getJoined(displayNames)
      const privateEvent = createEvent(`${joinedDisplayNames} imprison your ${highestPlayScheme.rank}s in the dungeon.`)
      highPlayer.events.push(privateEvent)
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
  const notFifteen = highestPlayScheme.rank !== 15
  const multipleHighPlayers = highPlayers.length > 1
  if (notFifteen || multipleHighPlayers) {
    const fifteenPlayers = playState
      .players
      .filter(player => player.playScheme?.rank === 15)
    const fifteenDisplayNames = fifteenPlayers.map(p => p.displayName)
    const joined = getJoined(fifteenDisplayNames)
    const childMessage = notFifteen
      ? `The highest rank scheme in play is ${highestPlayScheme.rank}, not 15.`
      : `${joined} all played 15, so they are imprisoned in the dungeon, not summoned to the court.`
    const highestChild = createEvent(childMessage)
    if (fifteenPlayers.length === 1) {
      const fifteenPlayer = guardFirst(fifteenPlayers, 'Fifteen player')
      const privateMessage = 'You do not carry out the threat on your 15.'
      const privateEvent = createEvent(privateMessage)
      privateEvent.events.push(highestChild)
      fifteenPlayer.events.push(privateEvent)
      const otherPlayers = playState
        .players
        .filter(player => player.id !== fifteenPlayer.id)
      const publicEvent = addBroadcastEvent({
        players: otherPlayers,
        game: playState.game,
        message: `${fifteenPlayer.displayName} does not carry out the threat on their 15.`
      })
      publicEvent.events.push(highestChild)
    } else if (fifteenPlayers.length > 0) {
      fifteenPlayers.forEach(fifteenPlayer => {
        const otherFifteenPlayers = fifteenPlayers
          .filter(player => player.id !== fifteenPlayer.id)
        const otherDisplayNames = otherFifteenPlayers.map(p => p.displayName)
        const displayNames = ['You', ...otherDisplayNames]
        const joined = getJoined(displayNames)
        const message = `${joined} do not carry out the threats on their 15s.`
        const event = createEvent(message, [highestChild])
        fifteenPlayer.events.push(event)
      })
      const displayNames = fifteenPlayers.map(p => p.displayName)
      const joined = getJoined(displayNames)
      const notFifteenPlayers = playState
        .players
        .filter(player => player.playScheme?.rank !== 15)
      const event = addBroadcastEvent({
        players: notFifteenPlayers,
        game: playState.game,
        message: `${joined} do not carry out the threats on their 15s.`
      })
      event.events.push(highestChild)
    }
  }
  drawUpToThree({ playState, transaction })
}
