
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    getByUsername,
    remove,
    update,
    add
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('user')
        var users = await collection.find(criteria).toArray()
        users = users.map(user => {
            delete user.password
            user.createdAt = ObjectId(user._id).getTimestamp()
            // Returning fake fresh data
            // user.createdAt = Date.now() - (1000 * 60 * 60 * 24 * 3) // 3 days ago
            return user
        })
        return users
    } catch (err) {
        logger.error('cannot find users', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ '_id': ObjectId(userId) })
        delete user.password
        return user
    } catch (err) {
        logger.error(`while finding user ${userId}`, err)
        throw err
    }
}

async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ username })
        return user
    } catch (err) {
        logger.error(`while finding user ${username}`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection('user')
        await collection.deleteOne({ '_id': ObjectId(userId) })
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    try {
        const userToSave = {
            ...user,
            _id: ObjectId(user._id), // needed for the returnd obj
        }
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
        return userToSave;
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

// Ori - Capitalize userPref Artists Name:

// capitalizeFullName('ori sharon')
function capitalizeFullName(fullname) {
    return fullname.split(' ').map(word => word[0].toUpperCase() + word.substr(1)).join(' ')
}

async function capitalizeSigleUserPref(userPref) {
    return userPref.map(pref => {
        newPref = { ...pref }
        newPref.artist = capitalizeFullName(newPref.artist)
        return newPref
    })
}


// TODO:
// capitalizeUsersPref()
async function capitalizeUsersPref() {
    try {
        const collection = await dbService.getCollection('user')
        const users = collection.find().toArray()
        const updatedUsers = users.map(user => {
            newUser = { ...user }
            newUser.userPref = capitalizeSigleUserPref(newUser.userPref)
            return newUser
        })
        updatedUsers.forEach(user => update(user))

    }
    catch (err) {
        console.log('err capitalizing', err);
    }
}




// username: null,
// password: null,
// fullname: null,
// facebookUserId: null,
// facebookImg: null
async function add(user) {
    try {
        let userToAdd = {
            username: user.username,
            fullname: user.fullname,
            password: user.password,
            likedTracks: [],
            likedStations: [],
            recentlyPlayedStations: [],
            recentlyPlayedSongs: [],
            userPref: user.userPref,
            following: []
        }
        if (user.facebookUserId) {
            userToAdd.facebookUserId = user.facebookUserId
            userToAdd.img = user.img
        }
        const collection = await dbService.getCollection('user')
        let userExists = await getByUsername(userToAdd.username)
        if (!userExists) {
            await collection.insertOne(userToAdd)
        }
        return userToAdd

    } catch (err) {
        logger.error('cannot insert user', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                username: txtCriteria
            },
            {
                fullname: txtCriteria
            }
        ]
    }
    //if (filterBy.minBalance) {
    //    criteria.balance = { $gte: filterBy.minBalance }
    //}
    return criteria
}




