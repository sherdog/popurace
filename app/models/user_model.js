const mongoose = require('mongoose'),
Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

const UserSchema = new Schema({
	username: { type: String, index: { unique: true } },
	password: { type: String, required: true },
	community: {
		type: Schema.Types.ObjectId,
		ref: 'community',
		default: null
	},
	}, { 
		strict: false,
		versionKey: false 
	}
);

UserSchema.pre('save', function(next) {
	var user = this;

	if (!user.isModified('password')) return next();

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
		if(err) return next(err);

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

let User = module.exports = mongoose.model('user', UserSchema);
