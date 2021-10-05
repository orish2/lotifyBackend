const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const socketService = require('../../services/socket.service')
const stationService = require('./station.service')

async function getStations(req, res) {
    try {
        var queryParams = req.query;
        const stations = await stationService.query(queryParams)
        res.send(stations)

    } catch (err) {
        logger.error('Cannot get stations', err)
        res.status(500).send({ err: 'Failed to get stations' })
    }
}

async function getStationById(req, res) {
    try {
        const station = await stationService.getById(req.params.stationId)
        res.send(station)
    } catch (err) {
        logger.error('Failed to get station', err)
        res.status(500).send({ err: 'Failed to get station' })
    }
}

async function getStationByGenre(req, res) {
    try {
        const station = await stationService.getByGenre(req.params.stationId)
        res.send(station)
    } catch (err) {
        logger.error('Failed to get station', err)
        res.status(500).send({ err: 'Failed to get station' })
    }
}


async function addStation(req, res) {
    try {
        var station = req.body
        station = await stationService.add(station)
        res.send(station)
        // Give the user credit for adding a station
        //socketService.broadcast({ type: 'station-added', data: station, userId: station.byUserId })
        //socketService.emitToUser({ type: 'station-about-you', data: station, userId: station.aboutUserId })
        //socketService.emitTo({ type: 'user-updated', data: fullUser, label: fullUser._id })

    } catch (err) {
        console.log(err)
        logger.error('Failed to add station', err)
        res.status(500).send({ err: 'Failed to add station' })
    }
}


async function updateStation(req, res) {
    try {
        var station = req.body;
         station = await stationService.update(station)
        res.send(station)
    } catch (err) {
        logger.error('Failed to get station', err)
        res.status(500).send({ err: 'Failed to get station' })
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






module.exports = {
    getStations,
    deleteStation,
    addStation,
    getStationById,
    getStationByGenre,
    updateStation
}