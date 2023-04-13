import { createCloudFunction } from "../create/cloudFunction"
import guardPlayerData from "../guard/playerData"
import { createEvent } from "../create/event"
import { gamesLord } from "../db"
import { UnplaySchemeProps } from "../types"
import guardHandScheme from "../guard/handScheme"
import { arrayUnion, deleteField } from "firelord"

const unplayScheme = createCloudFunction<UnplaySchemeProps>(async (props, context, transaction) => {
  console.log('props.gameId', props.gameId)
  const { playerRef, profileRef, playerData } = await guardPlayerData({
    gameId: props.gameId,
    transaction,
    context
  })
  console.log('playerRef', playerRef)
  console.log(`unplaying scheme...`)
  const unplayScheme = guardHandScheme({ hand: playerData.hand, schemeId: props.schemeId })
  transaction.update(playerRef, {
    playId: deleteField(),
    history: arrayUnion(
      createEvent(`You returned scheme ${unplayScheme.rank} from play`)
    )
  })
  transaction.update(profileRef, {
    playEmpty: true,
    ready: false
  })
  const gameRef = gamesLord.doc(props.gameId)
  transaction.update(gameRef, {
    history: arrayUnion(
      createEvent(`${playerData.displayName} returned their scheme from play.`)
    )
  })
  console.log('unplayed scheme!')
})
export default unplayScheme