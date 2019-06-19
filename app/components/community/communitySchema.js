import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
	community_name: {
		type: String
	}
})

const Community = mongoose.model('Community', communitySchema);

export default Community;