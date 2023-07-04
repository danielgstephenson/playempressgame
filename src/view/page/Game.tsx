import { useParams } from 'react-router-dom'
import GameView from '../Game'

export default function GamePageView (): JSX.Element {
  const params = useParams()
  if (params.gameId == null) return <></>
  return <GameView gameId={params.gameId} />
}
