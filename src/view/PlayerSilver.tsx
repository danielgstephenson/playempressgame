import { useContext } from 'react'
import { playerContext } from '../reader/player'
import Status from './Status'

export default function PlayerSilverView (): JSX.Element {
  const { silver } = useContext(playerContext)
  return <Status label='Silver' value={silver} />
}
