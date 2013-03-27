
/*!
 * @list dependencies
 */

var permissions = APP.middlewares.permissions
  , EventService = APP.services.events
  , EventModel = APP.models.events.Event;

/*!
 * @route GET /events/all/
 * @description List all events
 */

APP.get('/events/all/', permissions.checkLogged, function(request, response, next) {
  var findAllEventsPromise = EventService.findAllEvents(request, false);
  findAllEventsPromise.then(function(events) {
    response.json(events);
  }, function(error) {
    response.json({ error : error.message });
  });
});

/*!
 * @route GET /event/:id/
 * @description Find one Event
 */

APP.get('/event/:id/', function(request, response, next) {
  // Event ObjectId
  var id = request.params.id;
  var findEventPromise = EventModel.findOne({ _id : id });
  findEventPromise.then(function(event) {
    response.json(event);
  }, function(error) {
    response.json({ error : error.message });
  });
});

/*!
 * @route POST /event/new/
 * @description Create a new Event
 */

APP.post('/event/new/', function(request, response, next) {
  // New Event Data
  var eventData = request.body;
  // Team to Associate with
  console.log(request.session);
  var teamId = request.session.team._id;
  // Call to the EventService
  var createEventPromise = EventService.createEvent(request, eventData, teamId);
  createEventPromise.then(function(event) {
    response.json(event);
  }, function(error) {
    response.json({ error : error.message });
  });
});

/*!
 * @route POST /event/update/:id/
 * @description Update an Event
 */

APP.post('/event/update/:id/', permissions.checkLogged, function(request, response) {
  // Event ObjectId
  var eventId = request.params.id
    , changes = request.body;
  if (eventId && eventId.toString() !== 'undefined') {
    var updateEventPromise = EventService.updateEvent(eventId, changes);
    updateEventPromise.then(function() {
      response.json({ success : true });
    }, function(error) {
      response.json({ error : error.message });
    });
  } else {
    response.json({ error : 'Must Provide an Event ID!' });
  };
});

/*!
 * @route DELETE /event/delete/:id/
 * @description Delete an Event
 */

APP.del('/event/delete/:id/', function(request, response, next) {
  var eventId = request.params.id;
  var deletePromise = EventService.deleteEvent(request, eventId);
  deletePromise.then(function() {
    response.json({ success : true });
  }, function(error) {
    response.json({ error : error.message });
  });
});

/* EOF */