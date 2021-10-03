const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')


async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('station')
        const stations = await collection.find().toArray()
        return stations
    } catch (err) {
        logger.error('cannot find reviews', err)
        throw err
    }

}

async function remove(reviewId) {
    try {
        const store = asyncLocalStorage.getStore()
        const { userId, isAdmin } = store
        const collection = await dbService.getCollection('review')
        // remove only if user is owner/admin
        const criteria = { _id: ObjectId(reviewId) }
        if (!isAdmin) criteria.byUserId = ObjectId(userId)
        await collection.deleteOne(criteria)
    } catch (err) {
        logger.error(`cannot remove review ${reviewId}`, err)
        throw err
    }
}


async function add(station) {
    try {
        // peek only updatable fields!
        //const stationToAdd = {
        //    byUserId: ObjectId(station.byUserId),
        //    aboutUserId: ObjectId(station.aboutUserId),
        //    txt: station.txt
        //}
        const stationToAdd = station
        const collection = await dbService.getCollection('station')
        await collection.insertOne(stationToAdd)
        console.log(stationToAdd, 'service');
        return stationToAdd;
    } catch (err) {
        logger.error('cannot insert station', err)
        throw err
    }
}

async function getById(stationId) {
    try {
        const collection = await dbService.getCollection('station')
        try {
            var station = await collection.findOne({ '_id': ObjectId(stationId) })
        }

        catch {
            var station = await collection.findOne({ 'genre': (stationId) })
            console.log(station.data, 'station');
        }
        return station
    }
    catch (err) {
        logger.error(`while finding station ${stationId}`, err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    return criteria
}




module.exports = {
    query,
    remove,
    add,
    getById
}


