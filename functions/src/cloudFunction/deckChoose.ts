import createCloudFunction from '../create/cloudFunction'
import createEvent from '../create/event'
import { Player, SchemeProps } from '../types'
import { arrayRemove, arrayUnion } from 'firelord'
import updateOtherPlayers from '../update/otherPlayers'
import guardChoice from '../guard/choice'
import getAllPlayers from '../get/allPlayers'
import getHighestRankScheme from '../get/highestRankScheme'
import guardHandScheme from '../guard/handScheme'
import getJoined from '../get/joined'
import { https } from 'firebase-functions/v1'
import { playersRef } from '../db'
import guardPlaySchemes from '../guard/playSchemes'
import serializeScheme from '../serialize/scheme'

const deckChoose = createCloudFunction<SchemeProps>(async (props, context, transaction) => {
  console.info(`Choosing scheme ${props.schemeId} to put on deck...`)
  const {
    choice,
    currentUid,
    currentGame,
    currentGameRef,
    currentPlayer,
    currentPlayerRef,
    schemeRef
  } = await guardChoice({
    gameId: props.gameId,
    transaction,
    context,
    schemeId: props.schemeId,
    label: 'Deck choice scheme'
  })
  const privateChoiceEvent = createEvent(`You put scheme ${schemeRef.rank} face down on your deck.`)
  const publicChoiceEvent = createEvent(`${currentPlayer.displayName} put a scheme face down on their deck.`)
  const waiting = currentGame.choices.length > 1
  if (waiting) {
    transaction.update(currentPlayerRef, {
      hand: arrayRemove(schemeRef),
      deck: arrayUnion(schemeRef),
      history: arrayUnion(privateChoiceEvent)
    })
    transaction.update(currentGameRef, {
      choices: arrayRemove(choice),
      history: arrayUnion(publicChoiceEvent)
    })
    updateOtherPlayers({
      currentUid,
      gameId: props.gameId,
      transaction,
      users: currentGame.users,
      update: {
        history: arrayUnion(publicChoiceEvent)
      }
    })
    return
  }
  const currentHand = currentPlayer.hand.filter(scheme => {
    return scheme.id !== props.schemeId
  })
  const currentDeck = [...currentPlayer.deck, schemeRef]
  const currentPlayerEvents = [...currentPlayer.history, privateChoiceEvent]
  const allPlayers = await getAllPlayers({
    currentPlayer,
    gameId: props.gameId,
    transaction
  })
  const playSchemes = guardPlaySchemes(allPlayers)
  const high = getHighestRankScheme(playSchemes)
  if (high == null) {
    throw new Error('No highest rank scheme.')
  }
  const highRank = String(high?.rank)
  const highEvent = createEvent(`The highest rank scheme in play is ${highRank}.`)
  const highs = playSchemes.filter(scheme => scheme.rank === high?.rank)
  const gameEvents = [highEvent]
  if (highs.length > 1) {
    const imprisonedPlayers = allPlayers.filter(player => {
      console.log('player', player)
      const scheme = guardHandScheme({
        hand: player.hand,
        schemeId: player.playScheme?.id,
        label: 'Play scheme'
      })
      return scheme.rank === high?.rank
    })
    const displayNames = imprisonedPlayers.map(player => player.displayName)
    const joined = getJoined(displayNames)
    const publicEvent = createEvent(`The ${highRank} played by ${joined} are imprisoned in the dungeon.`)
    gameEvents.push(publicEvent)
    allPlayers.forEach(player => {
      const current = player.id === currentPlayer.id
      let hand = current ? currentHand : []
      const deck = current ? currentDeck : []
      const events = current ? currentPlayerEvents : []
      const imprisoned = imprisonedPlayers
        .some(imprisonedPlayer => imprisonedPlayer.id === player.id)
      if (imprisoned) {
        const otherImprisoned = imprisonedPlayers.filter(imprisonedPlayer => {
          return imprisonedPlayer.id !== player.id
        })
        const otherDisplayNames = otherImprisoned.map(player => player.displayName)
        const privateDisplayNames = ['You', ...otherDisplayNames]
        const privateJoined = getJoined(privateDisplayNames)
        const rank = otherDisplayNames.length === 1 ? highRank : `${highRank}s`
        const privateEvent = createEvent(`${privateJoined} imprison your ${rank} in the dungeon.`)
        events.push(privateEvent)
        if (schemeRef.id === props.schemeId) {
          throw new https.HttpsError('invalid-argument', 'Cannot imprison your deck scheme.')
        }
        hand = hand?.filter(scheme => scheme.id !== high?.id)
      } else {
        currentPlayerEvents.push(publicEvent)
      }
      const playerRef = playersRef.doc(player.id)
      const playerChanges: Partial<Player['write']> = {}
      if (events.length > 0) {
        playerChanges.history = arrayUnion(...events)
      }
      if (hand.length > 0) {
        playerChanges.hand = arrayUnion(...hand)
      }
      if (deck.length > 0) {
        playerChanges.deck = arrayUnion(...deck)
      }
      transaction.update(playerRef, playerChanges)
    })
    transaction.update(currentGameRef, {
      choices: arrayRemove(choice),
      history: arrayUnion(...gameEvents)
    })
  } else {
    const summonee = allPlayers.find(player => player.playScheme?.id === high?.id)
    const displayName = String(summonee?.displayName)
    const publicEvent = createEvent(`The ${highRank} played by ${displayName} is summoned to the court.`)
    gameEvents.push(publicEvent)
    allPlayers.forEach(player => {
      console.log('player test:', player)
      console.log('current player test:', currentPlayer)
      const current = player.id === currentPlayer.id
      console.log('current test:', current)
      let hand = current ? currentHand : []
      console.log('hand test:', hand)
      const deck = current ? currentDeck : []
      const events = current ? currentPlayerEvents : []
      events.push(highEvent)
      const summoned = player.playScheme?.id === high?.id
      if (summoned) {
        const privateEvent = createEvent(`Your ${highRank} is summoned to the court.`)
        events.push(privateEvent)
        hand = hand.filter(scheme => scheme.id !== high?.id)
      } else {
        events.push(publicEvent)
      }
      const playerRef = playersRef.doc(player.id)
      const playerChanges: Partial<Player['write']> = {}
      if (events.length > 0) {
        playerChanges.history = arrayUnion(...events)
      }
      if (hand.length > 0) {
        playerChanges.hand = arrayUnion(...hand)
      }
      if (deck.length > 0) {
        playerChanges.deck = arrayUnion(...deck)
      }
      transaction.update(playerRef, playerChanges)
    })
    const highRef = serializeScheme(high)
    transaction.update(currentGameRef, {
      choices: arrayRemove(choice),
      court: arrayUnion(highRef),
      history: arrayUnion(...gameEvents)
    })
  }
  console.info(`Chose scheme with id ${props.schemeId} to put on deck!`)
})
export default deckChoose
