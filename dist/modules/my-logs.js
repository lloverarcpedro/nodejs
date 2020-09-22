"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.info = void 0;
const info = (text) => {
    console.log('INFO: ', text);
    return text;
};
exports.info = info;
const error = (text) => {
    console.log('ERROR: ', text);
    return text;
};
exports.error = error;
