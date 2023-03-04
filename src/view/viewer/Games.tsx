import { useContext } from 'react'
import gamesContext from '../../context/games'
import GameItemView from '../GameItem'
import CollectionViewer from './Collection'

export default function GamesViewer (): JSX.Element {
  const gamesState = useContext(gamesContext)
  if (gamesState.gamesStream == null) return <></>
  return <CollectionViewer stream={gamesState.gamesStream} View={GameItemView} />
}
