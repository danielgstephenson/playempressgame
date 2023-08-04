import { getFirelord, getFirestore } from 'firelord'
import admin from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'
import { firebaseConfig } from './secret'

import guardColor from './guard/color'
import schemesJson from './schemes.json'
import { Game, Player, SchemeData, SchemeEffect, User } from './types'
import effectsEight from './effects/eight'
import effectsNineteen from './effects/nineteen'
import effectsEleven from './effects/eleven'
import effectsFifteen from './effects/fifteen'
import effectsFive from './effects/five'
import effectsFour from './effects/four'
import effectsFourteen from './effects/fourteen'
import effectsNine from './effects/nine'
import effectsSeventeen from './effects/seventeen'
import effectsOne from './effects/one'
import effectsSeven from './effects/seven'
import effectsEighteen from './effects/eighteen'
import effectsSix from './effects/six'
import effectsSixteen from './effects/sixteen'
import effectsTen from './effects/ten'
import effectsThirteen from './effects/thirteen'
import effectsThree from './effects/three'
import effectsTwelve from './effects/twelve'
import effectsTwenty from './effects/twenty'
import effectsTwentyFive from './effects/twentyFive'
import effectsTwentyFour from './effects/twentyFour'
import effectsTwentyOne from './effects/twentyOne'
import effectsTwentyThree from './effects/twentyThree'
import effectsTwentyTwo from './effects/twentyTwo'
import effectsTwo from './effects/two'
import effectsZero from './effects/zero'

admin.initializeApp(firebaseConfig)
export const adminAuth = getAuth()
export const db = getFirestore()
db.settings({ ignoreUndefinedProperties: true })
export const gamesRef = getFirelord<Game>(db, 'games')
export const usersRef = getFirelord<User>(db, 'users')
export const playersRef = getFirelord<Player>(db, 'players')
export const effects: SchemeEffect[] = [
  effectsZero,
  effectsOne,
  effectsTwo,
  effectsThree,
  effectsFour,
  effectsFive,
  effectsSix,
  effectsSeven,
  effectsEight,
  effectsNine,
  effectsTen,
  effectsEleven,
  effectsTwelve,
  effectsThirteen,
  effectsFourteen,
  effectsFifteen,
  effectsSixteen,
  effectsSeventeen,
  effectsEighteen,
  effectsNineteen,
  effectsTwenty,
  effectsTwentyOne,
  effectsTwentyTwo,
  effectsTwentyThree,
  effectsTwentyFour,
  effectsTwentyFive
]
export const schemeData: SchemeData[] = schemesJson.map((scheme) => {
  const color = guardColor(scheme.color)
  const combined = {
    ...scheme,
    color
  }
  return combined
})
