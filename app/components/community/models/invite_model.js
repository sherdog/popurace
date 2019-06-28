const mongoose = require('mongoose')
const Schema = mongoose.Schema

let inviteSchema = new mongoose.Schema({
    invite_code: { type: String },
    from_user: { type: Schema.Types.ObjectId, ref='user' },
    community: { type: Schema.Types.ObjectId, ref='community' }
})