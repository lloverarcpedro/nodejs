"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getUsers = void 0;
const users_model_1 = __importDefault(require("../mongo/models/users-model"));
const getUsers = function (query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield users_model_1.default.find({ username: query });
            return users;
        }
        catch (e) {
            // Log Errors
            throw Error('Error while listing Users');
        }
    });
};
exports.getUsers = getUsers;
const createUser = function (user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userCreated = users_model_1.default.create(user);
            return userCreated;
        }
        catch (error) {
            throw Error('Error while creating Users');
        }
    });
};
exports.createUser = createUser;
