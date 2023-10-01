import createCloudFunction from '../create/cloudFunction'
import guardNewGame from '../guard/newGame'

const addGame = createCloudFunction(async (props, context, transaction) => {
  console.info('Adding game...')
  const id = await guardNewGame({ context, transaction })
  console.info(`Added game with id ${id}`)
})
export default addGame
