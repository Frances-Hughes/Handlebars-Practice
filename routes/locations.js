const express = require('express')

const db = require('../db')

const router = express.Router()
module.exports = router

// GET /locations
router.get('/', async (req, res) => {
  try {
    const locations = await db.getAllLocations()
    console.log(locations)
    const viewData = { locations: locations } //array of locations will be value of key locations
    res.render('showLocations', viewData)
  } catch (err) {
    console.error(err.message)
  }
})

// GET /locations/4/edit
router.get('/:id/edit', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const viewData = await db.getLocationById(id)
    res.render('editLocation', viewData)
  } catch (err) {
    console.error(err.message)
  }
})

// POST /locations/edit
router.post('/edit', async (req, res) => {
  try {
    await db.updateLocation(req.body)
    res.redirect('/locations')
  } catch (err) {
    console.error(err.message)
  }
})
