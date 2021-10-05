const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')
const logger = require('../../services/logger.service')


async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('station')
        const stations = await collection.find(criteria).toArray()
        return stations
    } catch (err) {
        logger.error('cannot find station', err)
        throw err
    }
}

//async function remove(stationId) {
//    try {
//        const store = asyncLocalStorage.getStore()
//        const { userId, isAdmin } = store
//        const collection = await dbService.getCollection('review')
//        // remove only if user is owner/admin
//        const criteria = { _id: ObjectId(reviewId) }
//        if (!isAdmin) criteria.byUserId = ObjectId(userId)
//        await collection.deleteOne(criteria)
//    } catch (err) {
//        logger.error(`cannot remove review ${reviewId}`, err)
//        throw err
//    }
//}


async function add(station) {
    try {
        const stationToAdd = station
        const collection = await dbService.getCollection('station')
        await collection.insertOne(stationToAdd)
        return stationToAdd;
    } catch (err) {
        logger.error('cannot insert station', err)
        throw err
    }
}

async function getById(stationId) {
    let station
    try {
        const collection = await dbService.getCollection('station')
        station = await collection.findOne({ '_id': ObjectId(stationId) })
        return station
    }
    catch (err) {
        logger.error(`while finding station ${stationId}`, err)
        throw err
    }
}
async function getByGenre(stationId) {
    let station
    try {
        const collection = await dbService.getCollection('station')
        station = await collection.findOne({ 'genre': (stationId) })
        return station
    }
    catch (err) {
        logger.error(`while finding station ${stationId}`, err)
        throw err
    }
}

async function update(station) {
    try {
        const stationToSave = {
            ...station,
            _id: ObjectId(station._id), // needed for the returnd obj
        }
        const collection = await dbService.getCollection('station')
        await collection.updateOne({ _id: stationToSave._id }, { $set: stationToSave })
        return stationToSave;
    } catch (err) {
        logger.error(`cannot update station ${station._id}`, err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    let criteria = {}
    if (filterBy.keySearch) {
        const txtCriteria = { $regex: filterBy.keySearch, $options: 'i' }
        criteria = { name: txtCriteria }
        //criteria = { $or: [{ name: { txtCriteria } }, { $in: { tags: { txtCriteria } } }] }
    }
    return criteria
}




module.exports = {
    query,
    //remove,
    add,
    getById,
    getByGenre,
    update
}


