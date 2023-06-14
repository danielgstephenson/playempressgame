import 'source-map-support/register'
import addGame from './cloudFunction/addGame'
import joinGame from './cloudFunction/joinGame'
import startGame from './cloudFunction/startGame'
import onCreateUser from './cloudFunction/onCreateUser'
import onDeleteUser from './cloudFunction/onDeleteUser'
import playReady from './cloudFunction/playReady'
import deckChoose from './cloudFunction/deckChoose'
import trashChoose from './cloudFunction/trashChoose'
import bid from './cloudFunction/bid'
import concede from './cloudFunction/concede'
import imprison from './cloudFunction/imprison'
import withdraw from './cloudFunction/withdraw'
import court from './cloudFunction/court'
import reorder from './cloudFunction/reorder'

exports.addGame = addGame
exports.bid = bid
exports.concede = concede
exports.court = court
exports.deckChoose = deckChoose
exports.imprison = imprison
exports.joinGame = joinGame
exports.onCreateUser = onCreateUser
exports.onDeleteUser = onDeleteUser
exports.playReady = playReady
exports.reorder = reorder
exports.startGame = startGame
exports.trashChoose = trashChoose
exports.withdraw = withdraw
