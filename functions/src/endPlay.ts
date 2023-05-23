import { Transaction } from 'firelord'
import createEvent from './create/event'
import getJoined from './get/joined'
import guardDefined from './guard/defined'
import guardHighestRankPlayScheme from './guard/highestRankPlayScheme'
import guardPlayScheme from './guard/playScheme'
import setPlayState from './setPlayState'
import { PlayState } from './types'

export default function endPlay ({
  playState,
  transaction
}: {
  playState: PlayState
  transaction: Transaction
}): void {
  const highestPlayScheme = guardHighestRankPlayScheme(playState.players)
  const highestPlayEvent = createEvent(`The highest rank scheme in play is ${highestPlayScheme.rank}.`)
  playState.players.forEach(player => {
    player.history.push(highestPlayEvent)
  })
  playState.game.history.push(highestPlayEvent)
  const highPlayers = playState.players.filter(player => player.playScheme?.rank === highestPlayScheme.rank)
  const notHighPlayers = playState.players.filter(player => player.playScheme?.rank !== highestPlayScheme.rank)
  if (highPlayers.length === 1) {
    const highPlayer = guardDefined(highPlayers[0], 'High player')
    playState.game.court.push(guardPlayScheme(highPlayer))
    highPlayer.playScheme = undefined
    const privateSummonEvent = createEvent(`Your ${highestPlayScheme.rank} is summoned to the court.`)
    highPlayer.history.push(privateSummonEvent)
    const publicSummonEvent = createEvent(`${highPlayer.displayName}'s ${highestPlayScheme.rank} is summoned to the court.`)
    notHighPlayers.forEach(notHighPlayer => {
      notHighPlayer.history.push(publicSummonEvent)
    })
    playState.game.history.push(publicSummonEvent)
  } else {
    const highDisplayNames = highPlayers.map(p => p.displayName)
    const joinedHighDisplayNames = getJoined(highDisplayNames)
    const publicEvent = createEvent(`The ${highestPlayScheme.rank}s played by ${joinedHighDisplayNames} are imprisoned in the dungeon.`)
    playState.game.history.push(publicEvent)
    notHighPlayers.forEach(p => p.history.push(publicEvent))
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
  }
  setPlayState({
    playState,
    transaction
  })
}
