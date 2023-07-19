import { useContext } from 'react'
import { playerContext } from '../reader/player'
import getInDiscardStyles from '../service/getInDiscardStyles'
import SchemesContainerView from './SchemesContainer'
import TinyExpandableSchemeView from './TinyExpandableScheme'
import TinySchemeCenterView from './TinySchemeCenter'

export default function DiscardContentView (): JSX.Element {
  const playerState = useContext(playerContext)
  if (playerState.discard == null || playerState.discard.length === 0) {
    return <TinySchemeCenterView />
  }
  const [first, ...rest] = playerState.discard
  const styles = getInDiscardStyles({
    discardId: first.id,
    discardRank: first.rank,
    playId: playerState.playScheme?.id
  })
  const firstView = <TinyExpandableSchemeView rank={first.rank} {...styles} mr='4px' />
  const restViews = rest?.map(scheme =>
    <TinyExpandableSchemeView rank={scheme.rank} key={scheme.id} />
  )
  return (
    <SchemesContainerView>{firstView} {restViews}</SchemesContainerView>
  )
}
