import createCloudFunction from '../create/cloudFunction'
import guardCurrentPlaying from '../guard/current/playing'
import createEvent from '../create/event'
import { PlayReadyProps } from '../types'
import { arrayUnion } from 'firelord'
import createEventUpdate from '../create/eventUpdate'
import guardHandScheme from '../guard/handScheme'
import updateOtherPlayers from '../update/otherPlayers'
import playLastReady from '../ready/last/play'
import guardString from '../guard/string'
import joinRanks from '../join/ranks'
import filterPlaySchemes from '../filterPlaySchemes'
import addEvent from '../add/event'
import setPlayState from '../setPlayState'
import createPlayState from '../create/playState'

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
  const readyProfiles = currentGame.profiles.filter(profile => profile.playReady)
  const realReadyCount = readyProfiles.length + 1
  const waiting = realReadyCount < currentGame.profiles.length
  if (waiting) {
    const publicUpdate = createEventUpdate(`${currentPlayer.displayName} is ready.`)
    const profiles = currentGame.profiles.map(profile => {
      if (profile.userId === currentUid) {
        return {
          ...profile,
          playReady: true
        }
      }
      return profile
    })
    transaction.update(currentGameRef, {
      profiles,
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
    const joinedBefore = joinRanks(currentPlayer.hand)
    addEvent(youEvent, `Your hand was ${joinedBefore}.`)
    currentPlayer.playScheme = playScheme
    currentPlayer.trashScheme = trashScheme
    const handAfter = filterPlaySchemes(currentPlayer)
    console.log('handAfter', handAfter)
    const joinedAfter = joinRanks(handAfter)
    addEvent(youEvent, `Your hand becomes ${joinedAfter}.`)
    const youUpdate = {
      events: arrayUnion(youEvent),
      playReady: true,
      playScheme,
      trashScheme
    }
    transaction.update(currentPlayerRef, youUpdate)
    console.info(`${currentUid} is ready!`)
    return
  }
  console.info('not waiting...')
  const playState = await createPlayState({
    currentGame,
    currentPlayer,
    transaction
  })
  playLastReady({
    playState,
    currentPlayer,
    trashScheme,
    playScheme
  })
  setPlayState({ playState, transaction })
  console.info(`${currentUid} was the last to ready!`)
})
export default playReady
