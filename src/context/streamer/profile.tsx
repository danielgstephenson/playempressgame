import { Profile } from '../../types'
import getFirestream from './getFirestream'

export const {
  docContext: profileContext,
  DocProvider: ProfileProvider
} = getFirestream<Profile>()
