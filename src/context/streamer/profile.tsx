import { Profile } from '../../types'
import streamDoc from './streamDoc'

export const {
  docContext: profileContext,
  DocProvider: ProfileProvider
} = streamDoc<Profile>({})
