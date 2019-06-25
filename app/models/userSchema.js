const mongoose = require('mongoose'),
 Schema = mongoose.Schema
 const bcrypt = require('bcrypt')
 const SALT_WORK_FACTOR = 10

const UserSchema = new Schema({
	username: { type: String, index: { unique: true } },
	password: { type: String, required: true },
	}, { 
		versionKey: false 
	}
);

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserByID = function(id, callback) {
	User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback) {
	var query = { username: username};
	User.findOne(query, callback);
}

UserSchema.pre('save', function(next) {
	var user = this;

	if (!user.isModified('password')) return next();

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
		if(error) return next(err);

		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);

			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function (password, callback) {
	bcrypt.compare(password, this.password, function(err, isMatch) {
		if(err) return callback(err);
		callback(null, isMatch);
	});
};