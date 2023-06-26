import { forwardRef, ReactNode, Ref, useContext } from 'react'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import { Scheme } from '../types'
import ExpandableSchemeView from './ExpandableScheme'
import HandSchemeView from './HandScheme'
import SmallSchemeView from './SmallScheme'

function View ({
  children,
  schemeId,
  scheme
}: {
  children?: ReactNode
  schemeId?: string
  scheme?: Scheme
},
ref: Ref<HTMLDivElement>): JSX.Element {
  const gameState = useContext(gameContext)
  const playerState = useContext(playerContext)

  const handScheme = playerState.hand?.find(s => s.id === schemeId)
  const inHand = handScheme != null
  const ready = playerState.playReady === true
  const choosing = gameState.choices != null && gameState.choices.length > 0
  if (choosing) {
    if (scheme == null) {
      throw new Error('Choosing without scheme')
    }
    return <ExpandableSchemeView rank={scheme.rank} w='100%' />
  }
  if (ready) {
    if (inHand) {
      return <ExpandableSchemeView rank={handScheme.rank} w='100%' />
    }
    if (scheme == null) {
      throw new Error('Ready without scheme')
    }
    return <ExpandableSchemeView rank={scheme.rank} w='100%' />
  }
  if (schemeId == null) {
    return (
      <SmallSchemeView ref={ref} w='100%'>
        {children}
      </SmallSchemeView>
    )
  }
  if (!inHand) {
    throw new Error('Scheme not in hand')
  }
  return <HandSchemeView id={schemeId} w='100%' />
}

const SchemeAreaContentView = forwardRef(View)
export default SchemeAreaContentView
