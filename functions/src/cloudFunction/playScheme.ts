import { createCloudFunction } from "../create/cloudFunction"
import guardPlayId from "../guard/playId"
import guardPlayerData from "../guard/playerData"
import { createEvent } from "../create/event"
import { gamesLord, playersLord } from "../db"
import { PlaySchemeProps } from "../types"
import guardDefined from "../guard/defined"
import { arrayUnion } from "firelord"

const playScheme = createCloudFunction<PlaySchemeProps>(async (props, context, transaction) => {
  const { gameData, currentUid, playerRef, playerData, profileRef } = await guardPlayerData({
    gameId: props.gameId,
    transaction,
    context
  })
  guardPlayId({ hand: playerData.hand, id: props.schemeId })
  console.log(`playing scheme with id ${props.schemeId}...`)
  const gameRef = gamesLord.doc(props.gameId)
  const scheme = playerData.hand.find((scheme: any) => scheme.id === props.schemeId)
  const playScheme = guardDefined(scheme, 'Play Scheme')
  transaction.update(playerRef, {
    playId: props.schemeId,
    history: arrayUnion(
      createEvent(`You are playing scheme ${playScheme.rank}`)
    )
  })
  transaction.update(profileRef, {
    playEmpty: false,
    ready: false
  })
  const playEvent = createEvent(`${playerData.displayName} is playing a scheme`)
  transaction.update(gameRef, {
    history: arrayUnion(
      playEvent
    )
  })
  gameData.userIds.forEach( (userId : any) => {
    if(userId === currentUid) return
    const playerId = `${userId}_${props.gameId}`
    const playerRef = playersLord.doc(playerId)
    transaction.update(playerRef, {
      history: arrayUnion(playEvent)
    })
  })
  console.log(`played scheme with id ${props.schemeId}!`)
})
export default playScheme