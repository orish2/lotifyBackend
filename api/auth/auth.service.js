const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')


async function login(username, password) {
    logger.debug(`auth.service - login with username: ${username}`)

    const user = await userService.getByUsername(username)
    if (!user) return Promise.reject('Invalid username or password')
    // TODO: un-comment for real login
    // const match = await bcrypt.compare(password, user.password)
    // if (!match) return Promise.reject('Invalid username or password')

    delete user.password
    user._id = user._id.toString()
    return user
}

async function signup(user) {
    const saltRounds=10;
    logger.debug(`auth.service - signup with username: ${user.username}, fullname: ${user.fullname}`)
    if (!user.username || !user.password || !user.fullname) return Promise.reject('fullname, username and password are required!')
    const hash = await bcrypt.hash(user.password, saltRounds)
    user.password=hash;
    return await userService.add(user)
}

module.exports = {
    signup,
    login,
}