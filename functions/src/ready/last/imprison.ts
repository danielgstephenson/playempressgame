import joinRanksGrammar from '../../join/ranks/grammar'
import { Result, Player, PlayState } from '../../types'
import addPlayerEvent from '../../add/event/player'
import addEvent from '../../add/event'
import carryOutFourteen from '../../carryOut/fourteen'
import joinRanks from '../../join/ranks'
import getImprisonMessages from '../../get/imprisonMessages'

export default function imprisonLastReady ({
  currentPlayer,
  playState
}: {
  currentPlayer: Result<Player>
  playState: PlayState
}): void {
  const imprisonMessages = getImprisonMessages({
    game: playState.game,
    currentPlayer
  })
  addEvent(currentPlayer, imprisonMessages.privateMessage)
  playState.players.forEach(player => {
    if (player.id !== currentPlayer.id) {
      addEvent(player, imprisonMessages.publicMessage)
    }
  })
  const imprisoned = [...playState.game.court]
  const beforeDungeon = [...playState.game.dungeon]
  const beforeDungeonJoined = joinRanks(beforeDungeon)
  const beforeDungeonMessage = `The dungeon was ${beforeDungeonJoined}.`
  const beforeTimeline = [...playState.game.timeline]
  const beforeTimelineJoined = joinRanks(beforeTimeline)
  const beforeTimelineMessage = `The timeline was ${beforeTimelineJoined}.`
  const leftmost = playState.game.timeline.shift()
  const afterTimeline = [...playState.game.timeline]
  const afterTimelineJoined = joinRanks(afterTimeline)
  const afterTimelineMessage = `The timeline is now ${afterTimelineJoined}.`
  if (leftmost != null) {
    imprisoned.push(leftmost)
  }
  playState.game.court = []
  playState.game.dungeon.push(...imprisoned)
  const afterDungeon = [...playState.game.dungeon]
  const afterDungeonJoined = joinRanks(afterDungeon)
  const afterDungeonMessage = `The dungeon becomes ${afterDungeonJoined}.`
  const { grammar, joinedRanks } = joinRanksGrammar(imprisoned)
  const imprisonMessage = `Everyone is ready, so ${joinedRanks} ${grammar.toBe} imprisoned in the dungeon.`
  const observerEvent = addEvent(playState.game, imprisonMessage)
  addEvent(observerEvent, beforeTimelineMessage)
  addEvent(observerEvent, afterTimelineMessage)
  addEvent(observerEvent, beforeDungeonMessage)
  addEvent(observerEvent, afterDungeonMessage)
  playState.players.forEach(player => {
    const playerEndEvent = addPlayerEvent({
      container: player,
      message: imprisonMessage,
      round: playState.game.round,
      playerId: player.id
    })
    addEvent(playerEndEvent, beforeTimelineMessage)
    addEvent(playerEndEvent, afterTimelineMessage)
    addEvent(playerEndEvent, beforeDungeonMessage)
    addEvent(playerEndEvent, afterDungeonMessage)
    return playerEndEvent
  })
  carryOutFourteen({
    playState
  })
}
