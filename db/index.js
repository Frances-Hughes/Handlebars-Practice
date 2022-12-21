const environment = process.env.NODE_ENV || 'development'
const config = require('./knexfile')[environment]
const connection = require('knex')(config)

module.exports = {
  getAllLocations,
  getEventsByDay,
  getLocationById,
  updateLocation,
  addNewEvent,
  getEventById,
  updateEvent,
  deleteEvent,
}

// COMPLETED: use knex to get the real location data from the database
function getAllLocations(db = connection) {
  return db('locations').select('id', 'name', db.raw('"" as selected'))
}

function getEventsByDay(day, db = connection) {
  return db('events')
    .join('locations', 'events.location_id', 'locations.id')
    .select(
      'locations.name as locationName',
      'events.id as id',
      'events.name as eventName',
      'events.description as description',
      'events.time as time',
      'events.day as day'
    )
    .where('day', day)
}

// get by ID
function getLocationById(id, db = connection) {
  return db('locations').where('id', id).select().first()
}

function updateLocation(data) {
  const { id, name, description } = data
  return getLocationById(id).update({
    name,
    description,
  })
}

// ADD NEW EVENT
// TODO: write some more database functions
function addNewEvent(data, db = connection) {
  const { name, description, locationId, day, time } = data
  return db('events').insert({
    location_id: locationId,
    day,
    time,
    name,
    description,
  })
}

function getEventById(id, db = connection) {
  return db('events')
    .select(
      'id',
      'location_id as locationId',
      'day',
      'time',
      'name',
      'description'
    )
    .where('id', id)
    .first()
}

function updateEvent(data) {
  const { id, name, description, time, day, locationId } = data
  return getEventById(id).update({
    name,
    description,
    time,
    day,
    location_id: locationId,
  })
}

function deleteEvent(id) {
  return getEventById(id).delete()
}
