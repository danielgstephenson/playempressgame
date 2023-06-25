import React, { Fragment, useContext } from 'react'
import {
  SortableContext
} from '@dnd-kit/sortable'

import SchemesContainerView from './SchemesContainer'
import HandSchemeView from './HandScheme'
import playContext from '../context/play'
import { Heading } from '@chakra-ui/react'

export default function HandView (): JSX.Element {
  const {
    hand, trashSchemeId, playSchemeId, setHand
  } = useContext(playContext)
  const sortableItems = hand?.map((scheme) => {
    if (scheme.id === trashSchemeId || scheme.id === playSchemeId) {
      return <Fragment key={scheme.id} />
    }
    return (
      <HandSchemeView key={scheme.id} id={scheme.id} />
    )
  })

  if (hand == null || setHand == null) {
    return <></>
  }

  return (
    <>
      <Heading size='sm'>Hand</Heading>
      <SortableContext items={hand}>
        <SchemesContainerView>
          {sortableItems}
        </SchemesContainerView>
      </SortableContext>
    </>
  )
}
