import { Scheme } from '../types'
import TinyExpandableSchemeView from './TinyExpandableScheme'
import { FlexProps } from '@chakra-ui/react'

export default function TinySchemesContentView ({
  firstOffset,
  schemes
}: {
  firstOffset?: boolean
  schemes?: Scheme[]
} & FlexProps): JSX.Element {
  if (schemes == null) return <></>
  if (firstOffset === true) {
    const [first, ...rest] = schemes
    const firstView = (
      <TinyExpandableSchemeView
        id={first.id}
        mr='4px'
        rank={first.rank}
      />
    )
    const restViews = rest.map((scheme) => {
      return (
        <TinyExpandableSchemeView
          key={scheme.id}
          id={scheme.id}
          rank={scheme.rank}
        />
      )
    })
    return (
      <>
        {firstView}
        {restViews}
      </>
    )
  }
  const views = schemes?.map(scheme =>
    <TinyExpandableSchemeView rank={scheme.rank} key={scheme.id} />
  )
  return <>{views}</>
}
