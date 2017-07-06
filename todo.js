'use strict'

const mongoose = require('mongoose'),
      mongooseApiQuery = require('mongoose-api-query'),
      createdModified = require('mongoose-createdmodified').createdModifiedPlugin
	  

const TodoSchema = new mongoose.Schema({
address : { building : Number, coord : [Number], street : String, zipcode : Number },
borough : String,
cuisine : String,
grades : [ { date : Date, grade : String, score : Number } ],
name : String,
restaurant_id : Number ,
loc: { 'type': {type: String, enum: "Point", default: "Point"}, coordinates: { type: [Number],   default: [0,0],index:'2dsphere' }}})
//TodoSchema.index({loc:{coordinates}: '2dsphere'});
TodoSchema.statics.search = function(search, cb) {
    var qry = this.find();
    if (search.name) {
        qry.where('name').in(search.name);
    }
    if (search.loc) {
		qry.where('loc').near({
        center: {
        type: 'Point',
        coordinates: search.loc
    },
    maxDistance: search.distance * 1000
        });
    }
    qry.exec(cb);
};
TodoSchema.plugin(mongooseApiQuery)
TodoSchema.plugin(createdModified, { index: true })



const Todo = mongoose.model('restaurant', TodoSchema)
module.exports = Todo
