// import * as admin from "firebase-admin";
import addGame from './cloudFunction/addGame'
import joinGame from './cloudFunction/joinGame'
import startGame from './cloudFunction/startGame'
import onCreateUser from './cloudFunction/onCreateUser'
import onDeleteUser from './cloudFunction/onDeleteUser'
import playTrash from './cloudFunction/playTrash'
import playPlay from './cloudFunction/playPlay'
import playUntrash from './cloudFunction/playUntrash'
import playUnplay from './cloudFunction/playUnplay'
import playReady from './cloudFunction/playReady'
import playUnready from './cloudFunction/playUnready'
import deckChoose from './cloudFunction/deckChoose'

// process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080'
exports.addGame = addGame
exports.joinGame = joinGame
exports.startGame = startGame
exports.onCreateUser = onCreateUser
exports.onDeleteUser = onDeleteUser
exports.playTrash = playTrash
exports.playPLay = playPlay
exports.playUntrash = playUntrash
exports.playUnplay = playUnplay
exports.playReady = playReady
exports.playUnready = playUnready
exports.deckChoose = deckChoose
