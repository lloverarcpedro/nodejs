"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    data: {
        age: Number,
        isMale: Boolean,
    },
    role: { type: String, enum: ['admin', 'seller'], default: 'seller' },
}, {
    timestamps: true,
});
exports.default = mongoose_1.model('User', userSchema);
