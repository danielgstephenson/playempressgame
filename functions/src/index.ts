import addGame from './cloudFunction/addGame'
import joinGame from './cloudFunction/joinGame'
import startGame from './cloudFunction/startGame'
import onCreateUser from './cloudFunction/onCreateUser'
import onDeleteUser from './cloudFunction/onDeleteUser'
import playReady from './cloudFunction/playReady'
import deckChoose from './cloudFunction/deckChoose'
import trashChoose from './cloudFunction/trashChoose'
import 'source-map-support/register'

exports.addGame = addGame
exports.deckChoose = deckChoose
exports.joinGame = joinGame
exports.onCreateUser = onCreateUser
exports.onDeleteUser = onDeleteUser
exports.playReady = playReady
exports.startGame = startGame
exports.trashChoose = trashChoose
