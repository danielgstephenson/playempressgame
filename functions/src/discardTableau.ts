import addEvent from './add/event'
import addPlayerEvent from './add/event/player'
import addTargetEvents from './add/events/target'
import { PLAYER_CHOOSE_MESSAGE, END_AUCTION_PLAYER, OBSERVER_CHOOSE_MESSAGE } from './constants'
import getJoined from './get/joined'
import getJoinedRanks from './get/joined/ranks'
import getJoinedRanksGrammar from './get/joined/ranks/grammar'
import { PlayState } from './types'

export default function discardTableau ({
  playState
}: {
  playState: PlayState
}): void {
  const fourteenPlayers = playState
    .players
    .filter(player => player.tableau.some(scheme => scheme.rank === 14))
  if (fourteenPlayers.length > 0) {
    playState.game.phase = 'reorder'
    const names = fourteenPlayers.map(player => player.displayName)
    const publicNames = getJoined(names)
    const publicMessage = `${publicNames} made no trades, so they carry out the threat on their 14s.`
    addEvent(playState.game, publicMessage)
    playState.players.forEach(player => {
      const fourteen = fourteenPlayers.some(fourteenPlayer => fourteenPlayer.id === player.id)
      if (fourteen) {
        const otherNames = names.filter(name => name !== player.displayName)
        const playerNames = ['You', ...otherNames]
        const privateNames = getJoined(playerNames)
        addPlayerEvent({
          container: player,
          message: `${privateNames} made no trades, so you carry out the threat on your 14s.`,
          round: playState.game.round,
          playerId: player.id
        })
      }
      return addPlayerEvent({
        container: player,
        message: publicMessage,
        round: playState.game.round,
        playerId: player.id
      })
    })
    playState.players.forEach(player => {
      const fourteen = fourteenPlayers.some(fourteenPlayer => fourteenPlayer.id === player.id)
      if (fourteen) {
        addTargetEvents({
          playState,
          message: `${player.displayName} is reordering their deck.`,
          targetMessages: {
            [player.id]: 'Reorder your deck.'
          }
        })
      }
    })
    return
  }
  playState.players.forEach(player => {
    if (player.tableau.length > 0) {
      player.tableau.sort((a, b) => a.rank - b.rank)
      const joined = getJoinedRanksGrammar(player.tableau)
      const discardBefore = [...player.discard]
      player.discard.push(...player.tableau)
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
          const before = getJoinedRanks(discardBefore)
          addEvent(event, `Your discard was ${before}.`)
          const after = getJoinedRanks(player.discard)
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
  playState.players.forEach(player => {
    Object.assign(player, END_AUCTION_PLAYER)
    addEvent(player, PLAYER_CHOOSE_MESSAGE)
  })
  playState.game.round = playState.game.round + 1
  playState.game.phase = 'play'
  addEvent(playState.game, OBSERVER_CHOOSE_MESSAGE)
}
