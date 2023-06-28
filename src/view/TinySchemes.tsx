import { Scheme } from '../types'
import TinySchemeView from './TinyScheme'
import SchemesContainerView from './SchemesContainer'

export default function TinySchemesView ({
  schemes
}: {
  schemes?: Scheme[]
}): JSX.Element {
  const views = schemes?.map(scheme =>
    <TinySchemeView rank={scheme.rank} key={scheme.id} />
  )
  return <SchemesContainerView>{views}</SchemesContainerView>
}
