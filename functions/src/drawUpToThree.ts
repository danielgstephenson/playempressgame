import { Transaction } from 'firelord'
import { PlayState } from './types'
import draw from './draw'
import addBroadcastEvent from './add/event/broadcast'
import setPlayState from './setPlayState'
import createEvent from './create/event'
import addPlayerEvent from './add/event/player'
import addEvent from './add/event'
import guardDefined from './guard/defined'
import guardHighestRankPlayScheme from './guard/highestRankPlayScheme'

export default function drawUpToThree ({
  playState,
  transaction
}: {
  playState: PlayState
  transaction: Transaction
}): void {
  const highestPlayScheme = guardHighestRankPlayScheme(playState.players)
  if (highestPlayScheme.rank === 15) {
    playState
      .players
      .filter(player => player.playScheme?.rank === highestPlayScheme.rank)
      .forEach(player => {
        if (player.playScheme?.rank === 15) {
          player.playScheme = undefined
        }
      })
  }
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
    const playerEvent = guardDefined(playerEvents.find(event => event.playerId === player.id), 'Player event')
    if (player.hand.length < 3) {
      const depth = 3 - player.hand.length
      const privateMessage = `You have ${player.hand.length} schemes in hand, so you draw ${depth}.`
      console.log('privateMessage', privateMessage)
      const privateEvent = addEvent(playerEvent, privateMessage)
      const publicMessage = `${player.displayName} has ${player.hand.length} schemes in hand, so they draw ${depth}.`
      const otherPlayers = playState.players.filter(p => p.id !== player.id)
      const otherPlayerEvents = otherPlayers.map(player => {
        const otherPlayerEvent = guardDefined(playerEvents.find(event => event.playerId === player.id), 'Other player event')
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
  setPlayState({ playState, transaction })
}
