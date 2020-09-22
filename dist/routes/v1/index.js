"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const products_routes_1 = __importDefault(require("./products-routes"));
const users_routes_1 = __importDefault(require("../v1/users-routes"));
const cc_routes_1 = __importDefault(require("../v1/cc-routes"));
exports.default = (app) => {
    app.use('/api/v1/users', users_routes_1.default);
    app.use('/api/v1/products', products_routes_1.default);
    app.use('/api/v1/cc', cc_routes_1.default);
};
