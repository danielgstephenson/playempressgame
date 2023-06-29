import { Scheme } from '../types'
import TinySchemeView from './TinyScheme'
import SchemesContainerView from './SchemesContainer'
import { FlexProps } from '@chakra-ui/react'

export default function TinySchemesView ({
  schemes,
  ...otherProps
}: {
  schemes?: Scheme[]
} & FlexProps): JSX.Element {
  const views = schemes?.map(scheme =>
    <TinySchemeView rank={scheme.rank} key={scheme.id} />
  )
  return <SchemesContainerView {...otherProps}>{views}</SchemesContainerView>
}