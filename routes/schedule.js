const express = require('express')

const { validateDay } = require('../helpers')
const db = require('../db')

const router = express.Router()
module.exports = router

// GET /schedule/friday

router.get('/:day', async (req, res) => {
  try {
    const day = validateDay(req.params.day)
    const eventData = await db.getEventsByDay(day)
    const viewData = {
      day: day,
      events: eventData,
    }
    res.render('showDay', viewData)
  } catch (err) {
    console.error(err.message)
  }
})
