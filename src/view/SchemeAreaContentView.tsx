import { forwardRef, ReactNode, Ref, useContext } from 'react'
import { SCHEME_WIDTH } from '../constants'
import { playerContext } from '../reader/player'
import { Scheme } from '../types'
import HandSchemeView from './HandScheme'
import SmallSchemeView from './SmallScheme'
import TinyExpandableSchemeView from './TinyExpandableScheme'

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
  const playerState = useContext(playerContext)
  const handScheme = playerState.hand?.find(s => s.id === schemeId)
  const inHand = handScheme != null
  const ready = playerState.playReady === true
  if (ready) {
    const rank = handScheme?.rank ?? scheme?.rank
    if (rank == null) {
      throw new Error('Ready without rank')
    }
    return (
      <TinyExpandableSchemeView rank={rank} />
    )
  }
  if (schemeId == null) {
    return (
      <SmallSchemeView ref={ref} minW={SCHEME_WIDTH}>
        {children}
      </SmallSchemeView>
    )
  }
  if (!inHand) {
    return <>x</>
    // throw new Error('Scheme not in hand')
  }
  return <HandSchemeView id={schemeId} />
}

const SchemeAreaContentView = forwardRef(View)
export default SchemeAreaContentView
