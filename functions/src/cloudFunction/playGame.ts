import createCloudFunction from '../create/cloudFunction'
import guardNewGame from '../guard/newGame'

const playGame = createCloudFunction(async (props, context, transaction) => {
  console.info('Playing new game...')
  const id = await guardNewGame({ context, transaction })
  console.info(`Started playing new game with id ${id}`)
})
export default playGame
