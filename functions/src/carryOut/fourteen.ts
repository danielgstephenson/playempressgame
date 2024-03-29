import addEvent from '../add/event'
import addPlayerEvent from '../add/event/player'
import addTargetEvents from '../add/events/target'
import createId from '../create/id'
import discardTableau from '../discardTableau'
import getGrammar from '../get/grammar'
import getLowestRankScheme from '../get/lowestRankScheme'
import join from '../join'
import joinRanks from '../join/ranks'
import { PlayState } from '../types'

export default function carryOutFourteen ({
  playState
}: {
  playState: PlayState
}): void {
  const lowest = getLowestRankScheme(playState.game.court)
  if (lowest != null) {
    const beforeDungeon = [...playState.game.dungeon]
    const beforeDungeonJoined = joinRanks(beforeDungeon)
    const beforeDungeonMessage = `The dungeon was ${beforeDungeonJoined}.`
    const imprisoned = playState.game.court.filter(scheme => scheme.rank === lowest.rank)
    playState.game.dungeon.push(...imprisoned)
    playState.game.court = playState.game.court.filter(scheme => scheme.rank !== lowest.rank)
    const afterDungeon = [...playState.game.dungeon]
    const afterDungeonJoined = joinRanks(afterDungeon)
    const afterDungeonMessage = `The dungeon becomes ${afterDungeonJoined}.`
    const message = `The lowest remaining court scheme, ${lowest.rank}, was imprisoned in the dungeon.`
    const observerEvent = addEvent(playState.game, message)
    addEvent(observerEvent, beforeDungeonMessage)
    addEvent(observerEvent, afterDungeonMessage)
    playState.players.forEach(player => {
      const playerEvent = addEvent(player, message)
      addEvent(playerEvent, beforeDungeonMessage)
      addEvent(playerEvent, afterDungeonMessage)
    })
  }
  const fourteenPlayers = playState
    .players
    .filter(player => player.tableau.some(scheme => scheme.rank === 14))
  if (fourteenPlayers.length > 0) {
    const names = fourteenPlayers.map(player => player.displayName)
    const publicNames = join(names)
    const publicMessage = `${publicNames} made no trades, so they carry out the threat on their 14s.`
    addEvent(playState.game, publicMessage)
    playState.players.forEach(player => {
      const fourteen = fourteenPlayers.some(fourteenPlayer => fourteenPlayer.id === player.id)
      if (fourteen) {
        const otherNames = names.filter(name => name !== player.displayName)
        const playerNames = ['You', ...otherNames]
        const privateNames = join(playerNames)
        const grammar = getGrammar(otherNames.length, '14', '14s')
        return addPlayerEvent({
          container: player,
          message: `${privateNames} made no trades, so you carry out the threat on your ${grammar.noun}.`,
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
        const publicNot = 'so they can not reorder it'
        const privateNot = 'so you can not reorder it'
        if (player.deck.length === 0) {
          addTargetEvents({
            playState,
            message: `${player.displayName}'s deck is empty, so ${publicNot}`,
            targetMessages: {
              [player.id]: `Your deck is empty, so ${privateNot}.`
            }
          })
        } else if (player.deck.length === 1) {
          addTargetEvents({
            playState,
            message: `${player.displayName}'s deck has only one scheme, so ${publicNot}`,
            targetMessages: {
              [player.id]: `Your deck has only one scheme, so ${privateNot}.`
            }
          })
        } else {
          playState.game.choices.push({
            id: createId(),
            playerId: player.id,
            type: 'deck'
          })
          addTargetEvents({
            playState,
            message: `${player.displayName} is reordering their deck.`,
            targetMessages: {
              [player.id]: 'Reorder your deck.'
            }
          })
        }
      }
    })
    if (playState.game.choices.length > 0) {
      return
    }
  }
  discardTableau({ playState })
}
