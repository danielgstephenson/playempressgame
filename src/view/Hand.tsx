import React, { Fragment, useContext } from 'react'
import {
  SortableContext
} from '@dnd-kit/sortable'

import SchemesContainerView from './SchemesContainer'
import HandSchemeView from './HandScheme'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import TinySchemesView from './TinySchemes'

export default function HandView (): JSX.Element {
  const {
    hand, trashSchemeId, playSchemeId
  } = useContext(playContext)
  const { choices, phase } = useContext(gameContext)
  const playerState = useContext(playerContext)
  const sortableItems = hand?.map((scheme) => {
    if (scheme.id === trashSchemeId || scheme.id === playSchemeId) {
      return <Fragment key={scheme.id} />
    }
    return (
      <HandSchemeView key={scheme.id} id={scheme.id} />
    )
  })

  const playing = phase === 'play'
  const choosing = choices?.some(choice => choice.playerId === playerState.id)
  const chosen = !playing || playerState.playReady === true
  if (choosing !== true && chosen) {
    return <TinySchemesView schemes={hand} justifyContent='center' />
  }
  if (hand == null) {
    return <></>
  }

  return (
    <SortableContext items={hand}>
      <SchemesContainerView justifyContent='center'>
        {sortableItems}
      </SchemesContainerView>
    </SortableContext>
  )
}
