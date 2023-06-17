import { Dispatch, ReactNode, SetStateAction } from 'react'
import { Scheme } from '../types'
import SchemesContainer from './SchemesContainer'
import Sortables from './Sortables'
import SortableScheme from './SortableScheme'

export default function SortableSchemes ({
  children,
  schemes,
  setSchemes
}: {
  children?: ReactNode
  schemes: Scheme[]
  setSchemes?: Dispatch<SetStateAction<Scheme[]>>
}): JSX.Element {
  const sortableSchemes = schemes.map((scheme, index) => {
    return (
      <SortableScheme
        key={scheme.id}
        id={scheme.id}
        rank={scheme.rank}
        index={index}
      >
        {children}
      </SortableScheme>
    )
  })
  return (
    <Sortables
      items={schemes}
      setItems={setSchemes}
    >
      <SchemesContainer>
        {sortableSchemes}
      </SchemesContainer>
    </Sortables>
  )
}
