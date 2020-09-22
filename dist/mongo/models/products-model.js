"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: String, required: true },
    images: { type: [{ type: String, required: true }], default: ['https://static.thenounproject.com/png/1375595-200.png'] },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', require: true }
}, {
    timestamps: true,
});
exports.default = mongoose_1.model('Product', productSchema);
// export {model}
