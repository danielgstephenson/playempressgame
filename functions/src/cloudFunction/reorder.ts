import createCloudFunction from '../create/cloudFunction'
import { SchemesProps } from '../types'
import { https } from 'firebase-functions/v1'
import join from '../join'
import getGrammar from '../get/grammar'
import addEvent from '../add/event'
import joinRanks from '../join/ranks'
import guardCurrentReordering from '../guard/current/reordering'
import joinRanksGrammar from '../join/ranks/grammar'
import { arrayRemove, arrayUnion } from 'firelord'
import createEvent from '../create/event'
import { playersRef } from '../db'
import guardString from '../guard/string'
import createPlayState from '../create/playState'
import addTargetEvents from '../add/events/target'
import reserveInPlay from '../reserveInPlay'
import setPlayState from '../setPlayState'
import guardDefined from '../guard/defined'

const reorder = createCloudFunction<SchemesProps>(async (props, context, transaction) => {
  const gameId = guardString(props.gameId, 'Reorder game id')
  const {
    currentGame,
    currentGameRef,
    currentUid,
    currentPlayer,
    currentPlayerRef,
    currentPlayerId
  } = await guardCurrentReordering({
    gameId,
    transaction,
    context
  })
  console.info(`Reordering ${currentPlayer.displayName}'s reserve...`)
  const choice = currentGame
    .choices
    .find(choice =>
      choice.playerId === currentPlayerId
    )
  if (choice == null) {
    throw new https.HttpsError(
      'failed-precondition',
      'You are not reordering.'
    )
  }
  const extra = props
    .schemeIds
    .filter(id => currentPlayer
      .reserve
      .every(scheme => scheme.id !== id)
    )
  if (extra.length > 0) {
    const joined = join(extra)
    const grammar = getGrammar(extra.length)
    throw new https.HttpsError(
      'failed-precondition',
      `${joined} ${grammar.toBe} not in your reserve.`
    )
  }
  const missing = currentPlayer
    .reserve
    .filter(scheme => props
      .schemeIds
      .every(id => scheme.id !== id)
    )
  if (missing.length > 0) {
    const joined = joinRanks(missing)
    const grammar = getGrammar(missing.length)
    throw new https.HttpsError(
      'failed-precondition',
      `${joined} ${grammar.toBe} missing from your reserve.`
    )
  }
  const before = joinRanksGrammar(currentPlayer.reserve)
  const beforeMessage = `Your reserve was ${before.joinedRanks}.`
  const schemes = props.schemeIds.map(id => {
    const scheme = currentPlayer
      .reserve
      .find(scheme => scheme.id === id)
    if (scheme == null) {
      throw new https.HttpsError(
        'failed-precondition',
        `Scheme ${id} not found.`
      )
    }
    return scheme
  })
  const joined = joinRanksGrammar(schemes)
  const afterMessage = `Your reserve becomes ${joined.joinedRanks}.`
  const privateReorderMessage = `You reorder your reserve to ${joined.joinedRanks}.`
  const publicReorderMessage = `${currentPlayer.displayName} reorders their reserve.`
  if (currentGame.choices.length === 1) {
    const playState = await createPlayState({
      currentGame,
      currentPlayer,
      transaction
    })
    playState.game.choices = []
    currentPlayer.reserve = schemes
    const reorderEvents = addTargetEvents({
      playState,
      message: publicReorderMessage,
      targetMessages: {
        [currentPlayerId]: privateReorderMessage
      }
    })
    const privateEvent = reorderEvents.targetEvents[currentPlayerId]
    const privateReorderEvent = guardDefined(privateEvent, 'Private reorder event')
    addEvent(privateReorderEvent, beforeMessage)
    addEvent(privateReorderEvent, afterMessage)
    reserveInPlay({ playState })
    setPlayState({ playState, transaction })
    console.info(`Reordered ${currentPlayer.displayName}'s reserve.`)
    return
  }
  const privateReorderEvent = createEvent(privateReorderMessage)
  addEvent(privateReorderEvent, beforeMessage)
  addEvent(privateReorderEvent, afterMessage)
  transaction.update(currentPlayerRef, {
    reserve: schemes,
    events: arrayUnion(privateReorderEvent)
  })
  const publicEvent = createEvent(publicReorderMessage)
  currentGame.profiles.forEach(profile => {
    if (profile.userId === currentUid) {
      return
    }
    const playerId = `${profile.userId}_${currentGame.id}`
    const playerRef = playersRef.doc(playerId)
    transaction.update(playerRef, {
      events: arrayUnion(publicEvent)
    })
  })
  transaction.update(currentGameRef, {
    choices: arrayRemove(choice),
    events: arrayUnion(publicEvent)
  })
  console.info(`Reordered ${currentPlayer.displayName}'s reserve.`)
})
export default reorder
