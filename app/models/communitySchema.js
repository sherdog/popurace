const mongoose = require('mongoose')

let communitySchema = new mongoose.Schema({
	community_name: String,
	id: String
})

communitySchema.statics.getById = function (id, callback) {
	this.findById(id, callback);
}

communitySchema.statics.getCommunityByName = function(communityName, callback) {
	var query = { name: communityName }
	this.findOne(query, callback);
}

communitySchema.statics.getCommunityByCommunityID = function(communityID, callback) {
	var query = { id: communityID }
	this.findOne(query, callback);
}

let Community = module.exports = mongoose.model('community', communitySchema);