import createCloudFunction from '../create/cloudFunction'
import guardCurrentPlaying from '../guard/current/player'
import createEvent from '../create/event'
import { PlayReadyProps } from '../types'
import { increment } from 'firelord'
import createHistoryUpdate from '../create/historyUpdate'
import createEventUpdate from '../create/eventUpdate'
import guardHandScheme from '../guard/handScheme'
import updateOtherPlayers from '../update/otherPlayers'
import playLastReady from '../state/playLastReady'
import guardString from '../guard/string'
import getOtherPlayers from '../get/otherPlayers'

const playReady = createCloudFunction<PlayReadyProps>(async (props, context, transaction) => {
  const gameId = guardString(props.gameId, 'Play ready game id')
  const trashSchemeId = guardString(props.trashSchemeId, 'Play ready trash scheme id')
  const playSchemeId = guardString(props.playSchemeId, 'Play ready play scheme id')
  const {
    currentGameRef,
    currentGame,
    currentUid,
    currentPlayer,
    currentPlayerRef
  } = await guardCurrentPlaying({
    gameId,
    transaction,
    context
  })
  console.info(`Setting ${currentUid} ready...`)
  const trashScheme = guardHandScheme({
    hand: currentPlayer.hand,
    schemeId: trashSchemeId,
    label: 'Play ready trash scheme'
  })
  const playScheme = guardHandScheme({
    hand: currentPlayer.hand,
    schemeId: playSchemeId,
    label: 'Play ready play scheme'
  })
  const realReadyCount = currentGame.readyCount + 1
  const waiting = realReadyCount < currentGame.profiles.length
  const newProfiles = currentGame.profiles.map(profile => {
    if (profile.userId === currentUid) {
      return {
        ...profile,
        ready: true
      }
    }
    return profile
  })
  if (waiting) {
    const youEvent = createEvent('You are ready.')
    const youUpdate = createHistoryUpdate(youEvent)
    console.log('waiting')
    const displayNameUpdate = createEventUpdate(`${currentPlayer.displayName} is ready.`)
    const newProfiles = currentGame.profiles.map(profile => {
      if (profile.userId === currentUid) {
        return {
          ...profile,
          ready: true
        }
      }
      return profile
    })
    transaction.update(currentGameRef, {
      readyCount: increment(1),
      profiles: newProfiles,
      ...displayNameUpdate
    })
    const userIds = currentGame.profiles.map(profile => profile.userId)
    updateOtherPlayers({
      currentUid,
      gameId,
      transaction,
      userIds,
      update: displayNameUpdate
    })
    transaction.update(currentPlayerRef, youUpdate)
    return
  }
  console.log('not waiting')
  const otherPlayers = await getOtherPlayers({
    currentUid,
    gameId,
    transaction
  })
  const readyPlayer = {
    ...currentPlayer,
    trashScheme,
    playScheme
  }
  const readiedPlayers = [readyPlayer, ...otherPlayers]
  currentGame.profiles = newProfiles
  const playState = {
    game: currentGame,
    players: readiedPlayers
  }
  playLastReady({ playState, currentPlayer, transaction })
  console.info(`${currentUid} is ready!`)
})
export default playReady
