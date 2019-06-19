var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require(bcrypt),
	SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
	username: { type: String, index: { unique: true } },
	password: { type: String, required: true }
});

UserSchema.pre('save', function(next) {
	var user = this;

	if (!user.isModified('password')) return next();

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
		if(error) retuen next(err);

		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);

			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword => (password, callback) {
	bcrypt.compare(password, this.password, function(err, isMatch) {
		if(err) return callback(err);
		callback(null, isMatch);
	});
};

module.exports = mongoose.model(User&, UserSchema);