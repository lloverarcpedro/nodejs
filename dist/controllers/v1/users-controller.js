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
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_model_1 = __importDefault(require("../../mongo/models/users-model"));
const products_model_1 = __importDefault(require("../../mongo/models/products-model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_services_1 = require("../../services/user-services");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield users_model_1.default.findOne({ email });
        if (user) {
            const equalP = yield bcrypt_1.default.compare(password, user.password);
            console.log(equalP);
            if (equalP) {
                const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: 60000 } //time in seconds
                );
                res.send({ status: 'OK', data: { token, expiresIn: '10 mins' } });
            }
            else {
                res.status(403).send({
                    status: 'Error',
                    message: 'Wrong Email or Password',
                });
                return;
            }
        }
        else {
            res.status(403).send({
                status: 'Error',
                message: 'Wrong Email or Password',
            });
            return;
        }
    }
    catch (error) {
        res.status(500).send({
            status: 'Error',
            message: error.message,
        });
        return;
    }
});
const createUSer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, data, role } = req.body;
        const hash = yield bcrypt_1.default.hash(password, 15);
        yield users_model_1.default.create({
            username,
            email,
            data,
            password: hash,
            role,
        });
        res.send({
            status: 'OK',
            message: 'User Created',
        });
    }
    catch (error) {
        console.log(error.code);
        if (error.code && error.code == 11000) {
            res.status(400).send({
                status: 'Duplicate Values',
                message: error.keyValue,
            });
            return;
        }
        res.status(500).send({
            status: 'Error',
            message: 'An Error Ocurred, try againg later',
        });
    }
});
const deleteUSer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        if (!userId) {
            throw new Error('missing parameter userId');
        }
        const deletedUser = yield users_model_1.default.findByIdAndDelete(userId);
        const deletedProducs = yield products_model_1.default.deleteMany({ user: userId });
        res.send({
            status: 'OK',
            data: {
                userDeleted: deletedUser.username,
                productsDeleted: deletedProducs,
            },
        });
    }
    catch (error) {
        res.status(500).send({
            status: 'Error',
            message: `Error deleting user : ${error.message}`,
        });
    }
});
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const role = req.sessionData.role;
        console.log(`User request role ${role}`);
        let users;
        if (role != 'admin')
            users = yield users_model_1.default.find({ role: 'seller' });
        else
            users = yield users_model_1.default.find().select({ password: 0, __v: 0, role: 0 });
        res.send({ status: 'OK', data: users });
    }
    catch (error) {
        res.status(500).send({ status: 'Error', message: error.message });
    }
});
const getTodosUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Validate request parameters, queries using express-validator
        const query = (_a = req.body.username) !== null && _a !== void 0 ? _a : '';
        const users = yield user_services_1.getUsers(query);
        res.send({ status: 'OK', data: users });
    }
    catch (error) {
        res.status(500).send({ status: 'Error', message: error.message });
    }
});
const createTodoUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userToCreate = req.body;
        const userCreated = yield user_services_1.createUser(userToCreate);
        if (!userCreated) {
            throw new Error('create user error');
        }
        res.send({ status: 'OK', data: userCreated });
    }
    catch (error) {
        res.status(500).send({ status: 'Error', message: error.message });
    }
});
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, data, userId } = req.body;
        //const requestUserId = req.sessionData.userId
        const updatedUSer = yield users_model_1.default.findByIdAndUpdate(userId, {
            username,
            email,
            data,
        });
        res.send({
            status: 'OK',
            data: `User updated : ${updatedUSer.username}`,
        });
    }
    catch (error) {
        if (error.code && error.code == 11000) {
            res.status(400).send({
                status: 'Duplicate Values',
                message: error.keyValue,
            });
            return;
        }
        res.status(500).send({
            status: 'Error',
            message: `Error updating user : ${error.message}`,
        });
    }
});
exports.default = {
    createUSer,
    deleteUSer,
    updateUser,
    getAllUsers,
    getTodosUsers,
    createTodoUser,
    login
};
