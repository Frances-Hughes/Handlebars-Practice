const environment = process.env.NODE_ENV || 'development'
const config = require('./knexfile')[environment]
const connection = require('knex')(config)

module.exports = {
  getAllLocations,
  getEventsByDay,
  getLocationById,
  updateLocation,
}

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

//get by ID
function getLocationById(id, db = connection) {
  return db('locations').where('id', id).select().first()
}

//uodateLocation
function updateLocation(data) {
  const { id, name, description } = data
  return getLocationById(id).update({
    name,
    description,
  })
}
