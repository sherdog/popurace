const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

let communitySchema = new mongoose.Schema({
	_id: Number,
	community_name: { type: String, default: "" },
	id: { type: String, default: "" },
	full: { type: Boolean, default: false },
	user_count: { type: Number, default: 0 },
	users: [
		{
			type: Schema.Types.ObjectId,
			default: null
		}
	]
})

communitySchema.pre('save', function(next) {
	var community = this;
	
	if (!community.isNew) return next();

	var current_date = (new Date()).valueOf().toString();
	var random = Math.random().toString();

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
		if(err) return next(err);

		bcrypt.hash(current_date + ' ' + random, salt, function(err, hash) {
			if (err) return next(err);

			community.id = hash;
			next();
		});
	});
});

let Community = module.exports = mongoose.model('community', communitySchema);