import { useContext } from 'react'
import { playerContext } from '../reader/player'
import Status from './Status'

export default function PlayerGoldView (): JSX.Element {
  const { gold } = useContext(playerContext)
  return <Status label='Gold' value={gold} />
}
