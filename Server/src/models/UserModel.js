const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: false
    },
    name:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    passwordHash: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["admin", "member"],
        default: "member"
    },
    groupIds: {
        type: [mongoose.Schema.Types.ObjectId], 
        ref: "Group",
        default: [] 
    }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
