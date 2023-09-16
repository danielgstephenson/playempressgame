import addEvent from './add/event'
import addPlayerEvent from './add/event/player'
import addTargetEvents from './add/events/target'
import { PLAYER_CHOOSE_MESSAGE, END_AUCTION_PLAYER, OBSERVER_CHOOSE_MESSAGE } from './constants'
import joinRanks from './join/ranks'
import joinRanksGrammar from './join/ranks/grammar'
import { PlayState } from './types'

export default function discardTableau ({
  playState
}: {
  playState: PlayState
}): void {
  playState.players.forEach(player => {
    if (player.tableau.length > 0) {
      player.tableau.sort((a, b) => b.rank - a.rank)
      const joined = joinRanksGrammar(player.tableau)
      const discardBefore = [...player.discard]
      player.discard.unshift(...player.tableau)
      player.tableau = []
      const privateMessage = `You put ${joined.joinedRanks} from your tableau on your discard.`
      const publicMessage = `${player.displayName} puts ${joined.joinedRanks} from their tableau on their discard.`
      addEvent(playState.game, publicMessage)
      playState.players.forEach(p => {
        if (p.userId === player.userId) {
          const event = addPlayerEvent({
            container: p,
            message: privateMessage,
            round: playState.game.round,
            playerId: player.id
          })
          const before = joinRanks(discardBefore)
          addEvent(event, `Your discard was ${before}.`)
          const after = joinRanks(player.discard)
          addEvent(event, `Your discard becomes ${after}.`)
        } else {
          addPlayerEvent({
            container: p,
            message: publicMessage,
            round: playState.game.round,
            playerId: player.id
          })
        }
      })
    }
  })
  playState.game.round = playState.game.round + 1
  const roundMessage = `Round ${playState.game.round} begins.`
  addTargetEvents({
    playState,
    message: roundMessage,
    roundEvent: true
  })
  if (playState.game.timeline.length === 0) {
    addTargetEvents({
      playState,
      message: 'The timeline is empty, so this the final play phase.'
    })
    playState.game.final = true
    const playerMessage = 'Choose one final scheme to trash and one final scheme to play.'
    const observerMessage = 'Everyone is choosing one final scheme to trash and one final scheme to play.'
    addTargetEvents({
      playState,
      observerMessage,
      playerMessage
    })
  } else {
    addTargetEvents({
      playState,
      observerMessage: OBSERVER_CHOOSE_MESSAGE,
      playerMessage: PLAYER_CHOOSE_MESSAGE
    })
  }
  playState.players.forEach(player => {
    Object.assign(player, END_AUCTION_PLAYER)
  })
  playState.game.phase = 'play'
  playState.game.timePassed = false
  playState.game.imprisoned = false
}
