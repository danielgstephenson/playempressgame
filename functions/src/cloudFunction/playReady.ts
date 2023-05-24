import createCloudFunction from '../create/cloudFunction'
import guardCurrentPlaying from '../guard/current/player'
import createEvent from '../create/event'
import { PlayReadyProps } from '../types'
import { arrayUnion, increment } from 'firelord'
import createEventUpdate from '../create/eventUpdate'
import guardHandScheme from '../guard/handScheme'
import updateOtherPlayers from '../update/otherPlayers'
import playLastReady from '../playLastReady'
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
  if (waiting) {
    const publicUpdate = createEventUpdate(`${currentPlayer.displayName} is ready.`)
    transaction.update(currentGameRef, {
      readyCount: increment(1),
      ...publicUpdate
    })
    const userIds = currentGame.profiles.map(profile => profile.userId)
    updateOtherPlayers({
      currentUid,
      gameId,
      transaction,
      userIds,
      update: publicUpdate
    })
    const youEvent = createEvent('You are ready.')
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
    const youUpdate = {
      history: arrayUnion(youEvent),
      ready: true,
      playScheme,
      trashScheme
    }
    transaction.update(currentPlayerRef, youUpdate)
    console.info(`${currentUid} is ready!`)
    return
  }
  console.log('not waiting...')
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
  const playState = {
    game: currentGame,
    players: readiedPlayers
  }
  console.log('before playLastReady')
  playLastReady({ playState, currentPlayer, transaction })
  console.info(`${currentUid} was the last to ready!`)
})
export default playReady
