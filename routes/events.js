const express = require('express')

const { eventDays, capitalise, validateDay } = require('../helpers')
const db = require('../db')

const router = express.Router()
module.exports = router

// GET /events/add/friday
router.get('/add/:day', async (req, res) => {
  try {
    const day = validateDay(req.params.day)
    const days = eventDays.map((eventDay) => ({
      value: eventDay,
      name: capitalise(eventDay),
      selected: eventDay === day ? 'selected' : '',
    }))

    const locations = await db.getAllLocations()

    const viewData = { locations, days, day }
    res.render('addEvent', viewData)
  } catch (err) {
    console.error(err.message)
  }
})

// POST /events/add
router.post('/add', async (req, res) => {
  try {
    const day = req.body.day

    await db.addNewEvent(req.body)

    res.redirect(`/schedule/${day}`)
  } catch (err) {
    console.error(err.message)
  }
})

// POST /events/delete
router.post('/delete', async (req, res) => {
  try {
    const id = Number(req.body.id)
    const day = validateDay(req.body.day)

    await db.deleteEvent(id)

    res.redirect(`/schedule/${day}`)
  } catch (err) {
    console.error(err.message)
  }
})

// GET /events/3/edit
router.get('/:id/edit', async (req, res) => {
  try {
    const id = Number(req.params.id)

    const event = await db.getEventById(id)

    const locations = await db.getAllLocations()

    const locationIndex = locations.findIndex(
      (location) => location.id === event.locationId
    )

    locations[locationIndex].selected = 'selected'

    // This is done for you
    const days = eventDays.map((eventDay) => ({
      value: eventDay,
      name: capitalise(eventDay),
      selected: eventDay === event.day ? 'selected' : '',
    }))

    const viewData = { event, locations, days }
    res.render('editEvent', viewData)
  } catch (err) {
    console.error(err.message)
  }
})

// POST /events/edit
router.post('/edit', async (req, res) => {
  try {
    const { name, description, time } = req.body
    const id = Number(req.body.id)
    const day = validateDay(req.body.day)
    const locationId = Number(req.body.locationId)

    await db.updateEvent({ id, name, description, time, day, locationId })

    res.redirect(`/schedule/${day}`)
  } catch (err) {
    console.error(err.message)
  }
})
