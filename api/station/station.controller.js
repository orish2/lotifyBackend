const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const socketService = require('../../services/socket.service')
const stationService = require('./station.service')

async function getStations(req, res) {
    try {
        const stations = await stationService.query()
        res.send(stations)
    } catch (err) {
        logger.error('Cannot get stations', err)
        res.status(500).send({ err: 'Failed to get stations' })
    }
}

async function deleteStation(req, res) {
    try {
        await stationService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete station', err)
        res.status(500).send({ err: 'Failed to delete station' })
    }
}


async function addStation(req, res) {
    try {
        var station = req.body
        station.byUserId = req.session.user._id
        station = await stationService.add(station)

        // prepare the updated station for sending out
        station.aboutUser = await userService.getById(station.aboutUserId)

        // Give the user credit for adding a station
        var user = await userService.getById(station.byUserId)
        user.score += 10;
        user = await userService.update(user)
        station.byUser = user
        const fullUser = await userService.getById(user._id)

        console.log('CTRL SessionId:', req.sessionID);
        socketService.broadcast({ type: 'station-added', data: station, userId: station.byUserId })
        socketService.emitToUser({ type: 'station-about-you', data: station, userId: station.aboutUserId })
        socketService.emitTo({ type: 'user-updated', data: fullUser, label: fullUser._id })

        res.send(station)

    } catch (err) {
        console.log(err)
        logger.error('Failed to add station', err)
        res.status(500).send({ err: 'Failed to add station' })
    }
}

module.exports = {
    getStations,
    deleteStation,
    addStation
}