import { forwardRef, Ref } from 'react'
import { SCHEME_WIDTH } from '../constants'
import SmallSchemeView from './SmallScheme'

function View ({ children }: {
  children?: React.ReactNode
},
ref: Ref<HTMLDivElement>): JSX.Element {
  return (
    <SmallSchemeView ref={ref} minW={SCHEME_WIDTH}>
      {children}
    </SmallSchemeView>
  )
}

const EmptySmallSchemeView = forwardRef(View)
export default EmptySmallSchemeView
