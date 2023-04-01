import { useContext } from 'react'
import { playerContext } from '../reader/player'
import StatusView from './Status'

export default function TrashView (): JSX.Element {
  const playerState = useContext(playerContext)
  /*
    (
      <Box key={index}>
        <Text>{scheme}</Text>
        <Action fn='trashScheme' label='Trash' props={{ schemeId: scheme, gameId: gameState.id }} />
      </Box>
    )
  */
  console.log('playerState', playerState)
  return (
    <StatusView label='Trash' value={playerState.trashScheme} />
  )
}
