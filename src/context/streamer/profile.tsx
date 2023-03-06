import { Profile } from '../../types'
import GameContentView from '../../view/GameContent'
import streamDoc from './streamDoc'

export const {
  docContext: profileContext,
  DocProvider: ProfileProvider
} = streamDoc<Profile>({ View: GameContentView })
