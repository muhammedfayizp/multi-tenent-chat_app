const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema({

    email: String,

    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization"
    },

    token: String,

    expiresAt: {
        type: Date,
        default: () => Date.now() + 24 * 60 * 60 * 1000
    }

});

module.exports = mongoose.model("Invite", inviteSchema);