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
exports.validateRole = exports.isAdmin = exports.isAuth = exports.isValidHostname = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_model_1 = __importDefault(require("../mongo/models/users-model"));
const isValidHostname = (req, res, next) => {
    const validHosts = ['localhost', 'grainchain.io'];
    if (validHosts.includes(req.hostname)) {
        next();
    }
    else {
        res.status(403).send({ status: 'Access denied' });
    }
};
exports.isValidHostname = isValidHostname;
const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('req.headers', req.headers);
    try {
        const token = req.headers.token;
        if (token) {
            const data = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = yield users_model_1.default.findOne({ _id: data.userId });
            req.sessionData = { userId: data.userId, role: data.role, email: user === null || user === void 0 ? void 0 : user.email, username: user === null || user === void 0 ? void 0 : user.username };
            next();
        }
        else {
            throw {
                code: 403,
                status: 'Access denied',
                message: 'Missing header token',
            };
        }
    }
    catch (error) {
        res
            .status(error.code || 500)
            .send({ status: 'Error', message: error.message });
    }
});
exports.isAuth = isAuth;
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role } = req.sessionData;
        console.log('isAdmin', role);
        if (role != 'admin')
            throw {
                code: 403,
                status: 'Access denied',
                message: 'Admin Only',
            };
        next();
    }
    catch (error) {
        res
            .status(error.code || 500)
            .send({ status: 'Error', message: error.message });
    }
});
exports.isAdmin = isAdmin;
const validateRole = (requiredRole) => {
    const middelware = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { role } = req.sessionData;
                console.log('role received', role);
                if (role != requiredRole)
                    throw {
                        code: 403,
                        status: 'Access denied',
                        message: `${requiredRole} only`,
                    };
                next();
            }
            catch (error) {
                res
                    .status(error.code || 500)
                    .send({ status: 'Error', message: error.message });
            }
        });
    };
    return middelware;
};
exports.validateRole = validateRole;
