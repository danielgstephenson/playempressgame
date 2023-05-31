import { Transaction } from 'firelord'
import { PlayState } from './types'
import draw from './draw'
import addBroadcastEvent from './add/event/broadcast'
import setPlayState from './setPlayState'
import createEvent from './create/event'
import addPlayerEvent from './add/event/player'
import addEvent from './add/event'
import getGrammar from './get/grammar'
import guardPlayerEvent from './guard/playerEvent'

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
  setPlayState({ playState, transaction })
}
