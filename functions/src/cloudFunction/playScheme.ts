import { createCloudFunction } from "../create/cloudFunction"
import guardPlayId from "../guard/playId"
import guardPlayerData from "../guard/playerData"
import { createEvent } from "../create/event"
import { gamesLord } from "../db"
import { PlaySchemeProps } from "../types"
import guardDefined from "../guard/defined"
import { arrayUnion } from "firelord"

const playScheme = createCloudFunction<PlaySchemeProps>(async (props, context, transaction) => {
  const { playerRef, playerData, profileRef } = await guardPlayerData({
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
      createEvent(`You played scheme ${playScheme.rank}`)
    )
  })
  transaction.update(profileRef, {
    playEmpty: false,
    ready: false
  })
  transaction.update(gameRef, {
    history: arrayUnion(
      createEvent(`${playerData.displayName} played a scheme`)
    )
  })
  console.log(`played scheme with id ${props.schemeId}!`)
})
export default playScheme