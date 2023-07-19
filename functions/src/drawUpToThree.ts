import { PlayState } from './types'
import draw from './draw'
import addBroadcastEvent from './add/event/broadcast'
import createEvent from './create/event'
import addPlayerEvent from './add/event/player'
import addEvent from './add/event'
import getGrammar from './get/grammar'
import guardPlayerEvent from './guard/playerEvent'
import guardFirst from './guard/first'
import join from './join'
import guardHighestRankPlayScheme from './guard/highestRankPlayScheme'
import guardPlayScheme from './guard/playScheme'
import addPlayerWinEvents from './add/events/player/win'
import addTargetEvents from './add/events/target'
import joinRanksGrammar from './join/ranks/grammar'
import getWinners from './get/winners'
import guardProfile from './guard/profile'

export default function drawUpToThree ({
  playState
}: {
  playState: PlayState
}): void {
  const highestPlayScheme = guardHighestRankPlayScheme(playState.players)
  const highPlayers = playState
    .players
    .filter(player => player.playScheme?.rank === highestPlayScheme.rank)
  highPlayers.forEach(player => {
    const playScheme = guardPlayScheme(player)
    player.tableau = player.tableau.filter(scheme => scheme.id !== playScheme.id)
  })
  const underPlayers = playState.players.filter(player => player.hand.length < 3)
  if (underPlayers.length === 0) {
    const message = 'Everyone has three or more schemes in hand.'
    addBroadcastEvent({
      players: playState.players,
      game: playState.game,
      message
    })
  } else {
    const observerEvent = createEvent('Everyone draws up to three.')
    playState.game.events.push(observerEvent)
    const playerEvents = playState.players.map(player => addPlayerEvent({
      container: player,
      message: 'Everyone draws up to three.',
      playerId: player.id
    }))
    playState.players.forEach(player => {
      const playerEvent = guardPlayerEvent({
        events: playerEvents, playerId: player.id
      })
      if (player.hand.length < 3) {
        const depth = 3 - player.hand.length
        const depthGrammar = getGrammar(depth)
        const { possessiveSecond, possessiveThird } = getGrammar(player.hand.length)
        const privateMessage = `You ${possessiveSecond} in hand, so you draw ${depthGrammar.spelled}.`
        const privateEvent = addEvent(playerEvent, privateMessage)
        const publicMessage = `${player.displayName} ${possessiveThird} in hand, so they draw ${depthGrammar.spelled}.`
        const otherPlayers = playState.players.filter(p => p.id !== player.id)
        const otherPlayerEvents = otherPlayers.map(player => {
          const otherPlayerEvent = guardPlayerEvent({
            events: playerEvents, playerId: player.id, label: 'Other'
          })
          const publicEvent = createEvent(publicMessage)
          otherPlayerEvent.events.push(publicEvent)
          return publicEvent
        })
        const publicEvents = {
          observerEvent,
          otherPlayerEvents
        }
        draw({
          depth,
          playState,
          player,
          privateEvent,
          publicEvents
        })
      }
    })
  }
  if (playState.game.final) {
    playState.players.forEach(player => {
      const profile = guardProfile(playState, player.userId)
      profile.deck = player.deck
      profile.discard = player.discard
      profile.hand = player.hand
      profile.privateTrashHistory = player.trashHistory
    })
    const winners = getWinners({ players: playState.players })
    if (winners.length > 1) {
      const winnerNames = winners.map(winner => winner.displayName)
      const joined = join(winnerNames)
      const loserMessage = `${joined} tie for the win.`
      const observerWinEvent = addEvent(playState.game, loserMessage)
      const playerWinEvents = playState.players.map(player => {
        const winner = winners.some(winner => winner.id === player.id)
        if (!winner) {
          return addPlayerEvent({
            container: player,
            message: loserMessage,
            playerId: player.id,
            round: playState.game.round
          })
        }
        const otherWinners = winners.filter(winner => winner.id !== player.id)
        const otherWinnerNames = otherWinners.map(winner => winner.displayName)
        const names = ['You', ...otherWinnerNames]
        const joined = join(names)
        const message = `${joined} tie for the win.`
        return addPlayerEvent({
          container: player,
          message,
          playerId: player.id,
          round: playState.game.round
        })
      })
      addPlayerWinEvents({
        playState,
        observerEvent: observerWinEvent,
        playerEvents: playerWinEvents
      })
      return
    }
    const winner = guardFirst(winners, 'Winner')
    const winnerMessage = 'You win.'
    const loserMessage = `${winner.displayName} wins.`
    const observerWinEvent = addEvent(playState.game, loserMessage)
    const playerWinEvents = playState.players.map(player => {
      const message = player.id === winner.id
        ? winnerMessage
        : loserMessage
      return addPlayerEvent({
        container: player,
        message,
        playerId: player.id,
        round: playState.game.round
      })
    })
    addPlayerWinEvents({
      playState,
      observerEvent: observerWinEvent,
      playerEvents: playerWinEvents
    })
    return
  }
  playState.players.forEach(player => {
    player.playReady = false
  })
  playState.game.profiles.forEach(profile => {
    profile.playReady = false
  })
  playState.game.phase = 'auction'
  const leftmost = playState.game.timeline[0]
  const courtJoined = joinRanksGrammar(playState.game.court)
  if (leftmost != null) {
    const auction = playState.game.timeline.length === 1 ? 'the final auction' : 'auction'
    const leftmostMessage = `${leftmost.rank} is up for ${auction}`
    const courtMessage = playState.game.court.length > 0
      ? ` with ${courtJoined.joinedRanks} in the court`
      : ' and the court is empty'
    const message = `${leftmostMessage}${courtMessage}.`
    addBroadcastEvent({
      players: playState.players,
      game: playState.game,
      message
    })
  } else {
    const message = `The timeline is empty, but ${courtJoined.joinedRanks} from the court ${courtJoined.grammar.toBe} up for the final auction.`
    addTargetEvents({ playState, message })
  }
}
