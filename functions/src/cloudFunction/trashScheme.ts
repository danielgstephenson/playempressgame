import { createCloudFunction } from "../create/cloudFunction"
import guardPlayId from "../guard/playId"
import guardPlayerData from "../guard/playerData"
import { gamesLord, playersLord } from "../db"
import { createEvent } from "../create/event"
import { TrashSchemeProps } from "../types"
import guardDefined from "../guard/defined"
import { arrayUnion } from "firelord"

const trashScheme = createCloudFunction<TrashSchemeProps>(async (props, context, transaction) => {
  const { currentUid, gameData, playerRef, playerData, profileRef } = await guardPlayerData({
    gameId: props.gameId,
    transaction,
    context
  })
  console.log('playerData test:', playerData)
  console.log('props.schemeId test:', props.schemeId)
  guardPlayId({ hand: playerData.hand, id: props.schemeId })
  const gameRef = gamesLord.doc(props.gameId)
  console.log(`trashing scheme with id ${props.schemeId}...`)
  const trashScheme = playerData.hand.find((scheme) => scheme.id === props.schemeId)
  const scheme = guardDefined(trashScheme, 'Trash Scheme')
  transaction.update(playerRef, {
    trashId: props.schemeId,
    history: arrayUnion(
      createEvent(`You are trashing scheme ${scheme.rank}`)
    )
  })
  transaction.update(profileRef, {
    trashEmpty: false,
    ready: false
  })
  const trashEvent = createEvent(`${playerData.displayName} is trashing a scheme`)
  transaction.update(gameRef, {
    history: arrayUnion(trashEvent)
  })
  gameData.userIds.forEach( (userId : any) => {
    if(userId === currentUid) return
    const playerId = `${userId}_${props.gameId}`
    const playerRef = playersLord.doc(playerId)
    transaction.update(playerRef, {
      history: arrayUnion(trashEvent)
    })
  })
  console.log(`trashed scheme with id ${props.schemeId}!`)
})
export default trashScheme