const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getStations, getStation, addStation } = require('./station.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getStations)
router.get('/:stationId', log, getStation)
router.post('/', log, addStation)
// router.post('/', log, requireAuth, addStation)
// router.delete('/:id', requireAuth, deleteReview)

module.exports = router