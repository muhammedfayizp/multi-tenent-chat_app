const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({

    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    },

    name: {
        type: String,
        required: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ] 


}, { timestamps: true });

module.exports = mongoose.model("Group", groupSchema);
