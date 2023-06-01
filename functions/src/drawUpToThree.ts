import { Transaction } from 'firelord'
import { PlayState, Player, Result } from './types'
import draw from './draw'
import addBroadcastEvent from './add/event/broadcast'
import setPlayState from './setPlayState'
import createEvent from './create/event'
import addPlayerEvent from './add/event/player'
import addEvent from './add/event'
import getGrammar from './get/grammar'
import guardPlayerEvent from './guard/playerEvent'
import guardFirst from './guard/first'
import getScore from './get/score'
import getJoined from './get/joined'

export default function drawUpToThree ({
  playState,
  transaction
}: {
  playState: PlayState
  transaction: Transaction
}): void {
  const underPlayers = playState.players.filter(player => player.hand.length < 3)
  if (underPlayers.length === 0) {
    const message = 'Everyone has three or more schemes in hand.'
    addBroadcastEvent({
      players: playState.players,
      game: playState.game,
      message
    })
    return setPlayState({ playState, transaction })
  }
  const observerEvent = createEvent('Everyone draws up to three.')
  playState.game.history.push(observerEvent)
  const playerEvents = playState.players.map(player => addPlayerEvent({
    events: player.history,
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
        otherPlayerEvent.children.push(publicEvent)
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
  playState.game.phase = 'auction'
  const leftmost = playState.game.timeline[0]
  if (leftmost == null) {
    const winners = playState.players.reduce<Array<Result<Player>>>((winners, player) => {
      if (winners.length === 0) {
        return [player]
      }
      const winner = guardFirst(winners, 'Winner')
      const winnerScore = getScore(winner)
      const score = getScore(player)
      if (score === winnerScore) {
        const tiers = [...winners, player]
        const handHighest = tiers.reduce((highest, tier) => {
          const highestScheme = tier.hand.reduce((highestScheme, scheme) => {
            return scheme.rank > highestScheme.rank ? scheme : highestScheme
          })
          if (highestScheme.rank > highest) {
            return highestScheme.rank
          }
          return highest
        }, 0)
        const highTiers = tiers.filter(tier => {
          const highestScheme = tier.hand.reduce((highestScheme, scheme) => {
            return scheme.rank > highestScheme.rank ? scheme : highestScheme
          })
          return highestScheme.rank === handHighest
        })
        return highTiers
      }
      if (score > winnerScore) {
        return [player]
      }
      return winners
    }, [])
    if (winners.length > 1) {
      const winnerNames = winners.map(winner => winner.displayName)
      const joined = getJoined(winnerNames)
      const message = `${joined} tie for the win.`
      addBroadcastEvent({
        players: playState.players,
        game: playState.game,
        message
      })
    }
    const winner = guardFirst(winners, 'Winner')
    const message = `${winner.displayName} wins.`
    addBroadcastEvent({
      players: playState.players,
      game: playState.game,
      message
    })
    return setPlayState({ playState, transaction })
  }
  const leftmostMessage = `${leftmost.rank} is up for auction`
  const courtMessage = playState.game.court.length > 0
    ? ` with ${getJoined(playState.game.court.map(scheme => scheme.rank))} in the court`
    : ''
  const message = `${leftmostMessage}${courtMessage}.`
  addBroadcastEvent({
    players: playState.players,
    game: playState.game,
    message
  })
  setPlayState({ playState, transaction })
}
