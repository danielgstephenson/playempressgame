import createCloudFunction from '../create/cloudFunction'
import createEvent from '../create/event'
import { Game, Player, Profile, SchemeProps, Write } from '../types'
import { arrayUnion, deleteField } from 'firelord'
import updateOtherPlayers from '../update/otherPlayers'
import guardChoice from '../guard/choice'
import getOtherPlayers from '../get/otherPlayers'
import getJoined from '../get/joined'
import { https } from 'firebase-functions/v1'
import guardChoiceChanges from '../guard/choiceChanges'
import guardHighs from '../guard/highs'
import choiceUpdatePlayer from '../update/ChoicePlayer'

const trashChoose = createCloudFunction<SchemeProps>(async (props, context, transaction) => {
  console.info(`Choosing scheme ${props.schemeId} to trash...`)
  const {
    choice,
    currentUid,
    currentGame,
    currentGameRef,
    currentPlayer,
    currentPlayerRef,
    currentProfileRef,
    schemeRef
  } = await guardChoice({
    gameId: props.gameId,
    transaction,
    context,
    schemeId: props.schemeId,
    label: 'Trash choice scheme'
  })
  const privateChoiceEvent = createEvent(`You chose scheme ${schemeRef.rank} to trash from your hand.`)
  const chosenPlayerEvents = [privateChoiceEvent]
  const publicChoiceEvent = createEvent(`${currentPlayer.displayName} chose a a scheme to trash from their hand.`)
  const chosenGameEvents = [publicChoiceEvent]
  const chosenPlayer = {
    ...currentPlayer,
    hand: currentPlayer.hand.filter(scheme => {
      return scheme.id !== props.schemeId
    })
  }
  const chosenProfileChanges: Write<Profile> = {}
  const otherPlayers = await getOtherPlayers({
    currentUid: currentPlayer.userId,
    gameId: props.gameId,
    transaction
  })
  const chosenPlayers = [chosenPlayer, ...otherPlayers]
  const chosenGameChoices = currentGame.choices.filter(gameChoice => gameChoice.id !== choice.id)
  const chosenGameChanges: Write<Game> = {}
  const waiting = currentGame.choices.length > 1
  if (waiting) {
    const playChanges = guardChoiceChanges({
      allPlayers: chosenPlayers,
      choice,
      currentPlayer: chosenPlayer,
      currentGame,
      oldPlayer: currentPlayer
    })
    if (playChanges.effectSummons.length > 0) {
      chosenGameChanges.court = arrayUnion(...playChanges.effectSummons)
    }
    if (playChanges.effectChoices.length > 0) {
      chosenGameChoices.push(...playChanges.effectChoices)
    }
    chosenPlayerEvents.push(...playChanges.effectPlayerEvents)
    transaction.update(currentPlayerRef, {
      ...playChanges?.playerChanges,
      history: arrayUnion(...chosenPlayerEvents)
    })
    transaction.update(currentProfileRef, {
      ...chosenProfileChanges,
      ...playChanges?.profileChanges
    })
    chosenGameChanges.choices = chosenGameChoices
    chosenGameChanges.history = arrayUnion(...chosenGameEvents)
    transaction.update(currentGameRef, chosenGameChanges)
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
  const playChanges = guardChoiceChanges({
    allPlayers: chosenPlayers,
    choice,
    currentPlayer: chosenPlayer,
    currentGame,
    oldPlayer: currentPlayer
  })
  const chosenGameSummons = [...playChanges.effectSummons]
  chosenPlayerEvents.push(...playChanges.effectPlayerEvents)
  if (playChanges.effectChoices.length > 0) {
    chosenGameChoices.push(...playChanges.effectChoices)
    if (chosenGameSummons.length > 0) {
      chosenGameChanges.court = arrayUnion(...chosenGameSummons)
    }
    transaction.update(currentGameRef, chosenGameChanges)
    transaction.update(currentPlayerRef, {
      ...playChanges.playerChanges,
      history: arrayUnion(...chosenPlayerEvents)
    })
    transaction.update(currentProfileRef, {
      ...chosenProfileChanges,
      ...playChanges.profileChanges
    })
  }
  const { high, highEvent, highRank, highRef, highRefs, highs } = guardHighs(chosenPlayers)
  chosenPlayerEvents.push(highEvent)
  chosenGameEvents.push(highEvent)
  if (highs.length > 1) {
    chosenGameChanges.dungeon = arrayUnion(...highRefs)
    const imprisonedPlayers = chosenPlayers.filter(player => {
      return player.playScheme?.rank === high?.rank
    })
    const displayNames = imprisonedPlayers.map(player => player.displayName)
    const joined = getJoined(displayNames)
    const publicEvent = createEvent(`The ${highRank} played by ${joined} are imprisoned in the dungeon.`)
    chosenGameEvents.push(publicEvent)
    chosenPlayers.forEach(player => {
      if (player.playScheme == null) {
        throw new https.HttpsError('failed-precondition', 'You have no play scheme.')
      }
      const current = player.id === currentPlayer.id
      const imprisonEvents = []
      const imprisoned = player.playScheme.rank === high?.rank
      const imprisonUpdate: Write<Player> = {}
      if (imprisoned) {
        const otherImprisoned = imprisonedPlayers.filter(imprisonedPlayer => {
          return imprisonedPlayer.id !== player.id
        })
        const otherDisplayNames = otherImprisoned.map(player => player.displayName)
        const privateDisplayNames = ['You', ...otherDisplayNames]
        const privateJoined = getJoined(privateDisplayNames)
        const rank = otherDisplayNames.length === 1 ? highRank : `${highRank}s`
        const privateEvent = createEvent(`${privateJoined} imprison your ${rank} in the dungeon.`)
        imprisonEvents.push(privateEvent)
        imprisonUpdate.playScheme = deleteField()
      } else {
        imprisonEvents.push(publicEvent)
      }
      choiceUpdatePlayer({
        choiceChanges: imprisonUpdate,
        current,
        events: [...chosenPlayerEvents, ...imprisonEvents],
        playChanges,
        player,
        transaction
      })
    })
  } else {
    chosenGameChanges.court = arrayUnion(highRef)
    const summonee = chosenPlayers.find(player => player.playScheme?.id === high?.id)
    const displayName = String(summonee?.displayName)
    const publicEvent = createEvent(`The ${highRank} played by ${displayName} is summoned to the court.`)
    chosenGameEvents.push(publicEvent)
    chosenPlayers.forEach(player => {
      const current = player.id === currentPlayer.id
      const summonEvents = [highEvent]
      const summoned = player.playScheme?.id === high?.id
      const summonChanges: Write<Player> = {}
      if (summoned) {
        const privateEvent = createEvent(`Your ${highRank} is summoned to the court.`)
        summonEvents.push(privateEvent)
        summonChanges.playScheme = deleteField()
      } else {
        summonEvents.push(publicEvent)
      }
      choiceUpdatePlayer({
        choiceChanges: summonChanges,
        current,
        events: [...chosenPlayerEvents, ...summonEvents],
        playChanges,
        player,
        transaction
      })
    })
  }
  transaction.update(currentGameRef, {
    ...chosenGameChanges,
    choices: chosenGameChoices,
    history: arrayUnion(...chosenGameEvents)
  })
  console.info(`Chose scheme with id ${props.schemeId} to trash!`)
})
export default trashChoose
