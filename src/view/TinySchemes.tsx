import { Scheme } from '../types'
import SchemesContainerView from './SchemesContainer'
import { FlexProps } from '@chakra-ui/react'
import TinySchemesContentView from './TinySchemesContent'

export default function TinySchemesView ({
  firstOffset,
  schemes,
  ...otherProps
}: {
  firstOffset?: boolean
  schemes?: Scheme[]
} & FlexProps): JSX.Element {
  return (
    <SchemesContainerView {...otherProps}>
      <TinySchemesContentView firstOffset={firstOffset} schemes={schemes} />
    </SchemesContainerView>
  )
}
