import { useContext } from 'react'
import { playerContext } from '../reader/player'
import getLastReserveStyles from '../service/getLastReserveStyles'
import TinyExpandableSchemeView from './TinyExpandableScheme'

export default function LastReserveView (): JSX.Element {
  const playerState = useContext(playerContext)
  if (playerState.reserve == null || playerState.reserve.length === 0) {
    return <></>
  }
  const last = playerState.reserve[playerState.reserve.length - 1]
  const styles = getLastReserveStyles({
    lastReserveId: last.id,
    lastReserveRank: last.rank,
    playId: playerState.playScheme?.id
  })
  return <TinyExpandableSchemeView rank={last.rank} {...styles} />
}
