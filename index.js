'use strict'

/**
 * Module Dependencies
 */
const _      = require('lodash'),
      errors = require('restify-errors')

/**
 * Model Schema
 */
const Todo = require('../models/todo')
//const NTodo = require('../models/ntodo')

/**
 * POST
 */
server.post('/todos', function(req, res, next) {

    let data = req.body || {}

    let todo = new Todo(data)
    todo.save(function(err) {

        if (err) {
            log.error(err)
            return next(new errors.InternalError(err.message))
            next()
        }

        res.send(201)
        next()

    })

})


/**
 * LIST
 */
server.get('/todos', function(req, res, next) {

    Todo.apiQuery(req.params, function(err, docs) {

        if (err) {
            log.error(err)
            return next(new errors.InvalidContentError(err.errors.name.message))
        }

        res.send(docs)
        next()

    })

})
/*server.get('/ntodos', function(req, res, next) {

    NTodo.apiQuery(req.params, function(err, docs) {

        if (err) {
            log.error(err)
            return next(new errors.InvalidContentError(err.errors.name.message))
        }

        res.send(docs)
        next()

    })

})
*/

/**
 * GET
 */
server.get('/todos/:todo_id', function(req, res, next) {

    Todo.findOne({ _id: req.params.todo_id }, function(err, doc) {

        if (err) {
            log.error(err)
            return next(new errors.InvalidContentError(err.errors.name.message))
        }

        res.send(doc)
        next()

    })

})
/**
 * GET around location
 */
server.get('/',function(req, res, next) {
    var limit = req.query.limit || 10;

    // get the max distance or set it to 8 kilometers
//    var maxDistance = parseFloat(req.query.distance) || 8;

    // we need to convert the distance to radians
    // the raduis of Earth is approximately 6371 kilometers
//    maxDistance /= 6371;

    // get coordinates [ <longitude> , <latitude> ]
    var coords = [];
    coords[0] = req.query.longitude || 0;
    coords[1] = req.query.latitude || 0;

    // find a location
    Todo.find({
      loc: {
        $near:{  
			$geometry: {
		type: "Point" ,coordinates:coords},
//		   $maxDistance: maxDistance
		}
      }
    }).limit(limit).exec(function(err, locations) {
      if (err) {
        return res.json(500, err);
      }

      res.json(200, locations);
    });
  })

/**
 * UPDATE
 */
server.put('/todos/:todo_id', function(req, res, next) {

    let data = req.body || {}

    if (!data._id) {
		_.extend(data, {
			_id: req.params.todo_id
		})
	}

    Todo.findOne({ _id: req.params.todo_id }, function(err, doc) {

		if (err) {
			log.error(err)
			return next(new errors.InvalidContentError(err.errors.name.message))
		} else if (!doc) {
			return next(new errors.ResourceNotFoundError('The resource you requested could not be found.'))
		}

		Todo.update({ _id: data._id }, data, function(err) {

			if (err) {
				log.error(err)
				return next(new errors.InvalidContentError(err.errors.name.message))
			}

			res.send(200, data)
            next()

		})

	})

})

/**
 * DELETE
 */
server.del('/todos/:todo_id', function(req, res, next) {

    Todo.remove({ _id: req.params.todo_id }, function(err) {

		if (err) {
			log.error(err)
			return next(new errors.InvalidContentError(err.errors.name.message))
		}

		res.send(204)
        next()

	})

})
