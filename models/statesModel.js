const mongoose = require("mongoose");

const stateSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    msgId: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null
    },
    isPhone: {
        type: Boolean,
        default: false
    },
    isAirtime: {
        type: Boolean,
        default: false
    },
    textValue: {
        type: String,
        default: null
    },
    plan_id: {
        type: String,
        default: null
    },
    network_id: {
        type: String,
        default: null
    },
    amount: {
        type: Number,
        default: null
    },
    referenceId: {
        type: String,
        default: null
    },
    isAUT: {
        type: Boolean,
        default: false
    },
    aut: {
        type: String,
        default: null
    },
    authaction: {
        type: String,
        default: null
    },
    auth: {
        type: Boolean,
        default: false
    },
    cpass: {
        type: Boolean,
        default: false
    },
    ncpass: {
        type: Boolean,
        default: false
    },
    dataAmount: {
        type: String,
        default: null
    },
    bugType: {
        type: String,
        default: null
    },
    bugAccountId: {
        type: String,
        default: null
    },
    bug: {
        type: Boolean,
        default: false
    },
    notuser: {
        type: Boolean,
        default: false
    },
    a: {
        type: Boolean,
        default: false
    },
    ref: {
        type: Boolean,
        default: false
    },
    p1c: {
        type: Boolean,
        default: false
    },
    retry: {
        type: Boolean,
        default: false
    },
    signin: {
        type: Boolean,
        default: false
    },

}, {
    timestamps: true
});

const State = mongoose.model("State", stateSchema)

module.exports = State;