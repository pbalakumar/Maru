
/*!
 * @service Event
 * @description Event Scheduling Service
 */

var Promise = APP.Promise
  , EventService = APP.services.event
  , EventModel = APP.models.events.Event;

/*!
 * @method findAllEvents
 * @param {Object} request Node.js Request
 * @param {Boolean} process Process events for "Full Calendar" format, or return raw json
 * @return {Object} promise Promise to reject or resolve
 *
 * FullCalendar Event Format:
 *
 * {
 *    title : String,
 *    start : Date,
 *    end   : Date,
 *  }
 */

exports.findAllEvents = function(request, process) {
  var promise = new Promise();
  if (request.session.team && request.session.team._id) {
    var query = { _team : request.session.team._id.toString() }; 
    var findAllEventsPromise = EventModel.find(query);
    findAllEventsPromise.then(function(events) {
      if (process === true) {
        for (var i = 0; i < events.length; i++) {
          events[i] = {
            title : events[i].title,
            start : new Date(events[i].start),
            end   : new Date(events[i].end)
          };
        };
        promise.resolve(events);
      } else if (process === false) {
        promise.resolve(events);
      };
    }, function(error) {
      promise.reject(error, true);
    });
  } else {
    promise.resolve({});
  }
  return promise;
};

/*!
 * @method createEvent
 * @param {Object} request Node.js Request object
 * @param {Object} eventData Event Form Data
 * @param {String} teamId ObjectId of Player/Owners Team
 * @descripton Create a new Event
 */

exports.createEvent = function(request, eventData, teamId) {
  var promise = new Promise();
  // Attach teamId to eventData
  eventData._team = teamId;
  // Create Event
  var createPromise = EventModel.create(eventData);
  createPromise.then(function(newEvent) {
    promise.resolve(newEvent);
  }, function(error) {
    APP.helpers.logger.error(error);
    promise.reject(error, true);
  });
  return promise;
};

/*!
 * @method updateEvent
 * @description Updates an Event Collection Item
 */

exports.updateEvent = function updateEvent(eventId, updates) {
  var promise = new Promise();
  var query = { _id : eventId };
  var updateEventPromise = EventModel.update(query, updates);
  updateEventPromise.then(function(rowsAffected) {
    APP.helpers.logger.log('Updated Events: ' + rowsAffected);
    promise.resolve(rowsAffected);
  }, function(error) {
    APP.helpers.logger.error(error);
    promise.reject(error, true);
  });
  return promise;
};

/*!
 * @method deleteEvent
 * @descripton Delete an Event
 */

exports.deleteEvent = function deleteEvent(request, eventId) {
  var promise = new Promise();
  var query = { _id : eventId.toString() };
  var removePromise = EventModel.remove(query);
  removePromise.then(function() {
    promise.resolve();
  }, function(error) {
    promise.reject(error, true);
  });
  return promise;
};

/* EOF */