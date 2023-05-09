import { getFirelord, getFirestore } from 'firelord'
import admin from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'
import { firebaseConfig } from './secret'

import effectZero from './effect/zero'
import effectOne from './effect/one'
import effectTwo from './effect/two'
import effectThree from './effect/three'
import effectFour from './effect/four'
import effectFive from './effect/five'
import effectSix from './effect/six'
import effectSeven from './effect/seven'
import effectEight from './effect/eight'
import effectNine from './effect/nine'
import effectTen from './effect/ten'
import effectEleven from './effect/eleven'
import effectTwelve from './effect/twelve'
import effectThirteen from './effect/thirteen'
import effectFourteen from './effect/fourteen'
import effectFifteen from './effect/fifteen'
import effectSixteen from './effect/sixteen'
import effectSeventeen from './effect/seventeen'
import effectEighteen from './effect/eighteen'
import effectNineteen from './effect/nineteen'
import effectTwenty from './effect/twenty'
import effectTwentyOne from './effect/twentyOne'
import effectTwentyTwo from './effect/twentyTwo'
import effectTwentyThree from './effect/twentyThree'
import effectTwentyFour from './effect/twentyFour'
import effectTwentyFive from './effect/twentyFive'
import guardColor from './guard/color'
import guardEffect from './guard/effect'
import schemesJson from './schemes.json'
import { Game, Player, SchemeData, SchemeEffect, User } from './types'

admin.initializeApp(firebaseConfig)
export const adminAuth = getAuth()
export const db = getFirestore()
db.settings({ ignoreUndefinedProperties: true })
export const gamesRef = getFirelord<Game>(db, 'games')
export const usersRef = getFirelord<User>(db, 'users')
export const playersRef = getFirelord<Player>(db, 'players')
export const effects: SchemeEffect[] = [
  effectZero,
  effectOne,
  effectTwo,
  effectThree,
  effectFour,
  effectFive,
  effectSix,
  effectSeven,
  effectEight,
  effectNine,
  effectTen,
  effectEleven,
  effectTwelve,
  effectThirteen,
  effectFourteen,
  effectFifteen,
  effectSixteen,
  effectSeventeen,
  effectEighteen,
  effectNineteen,
  effectTwenty,
  effectTwentyOne,
  effectTwentyTwo,
  effectTwentyThree,
  effectTwentyFour,
  effectTwentyFive
]
export const schemeData: SchemeData[] = schemesJson.map((scheme) => {
  const effect = guardEffect(scheme.rank)
  const color = guardColor(scheme.color)
  const combined = {
    ...scheme,
    color,
    effect
  }
  return combined
})
