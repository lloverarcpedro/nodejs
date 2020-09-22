"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middlewares/auth");
const users_controller_1 = __importDefault(require("../../controllers/v1/users-controller"));
const validator_1 = require("../../middlewares/validator");
const router = express_1.default.Router();
router.post('/create', validator_1.createValidation(), validator_1.validate, users_controller_1.default.createUSer);
router.put('/update', auth_1.isValidHostname, auth_1.isAuth, users_controller_1.default.updateUser);
router.post('/delete', auth_1.isAuth, auth_1.validateRole('admin'), users_controller_1.default.deleteUSer);
router.get('/getUsers', auth_1.isAuth, users_controller_1.default.getAllUsers);
router.post('/getUsersTodo', users_controller_1.default.getTodosUsers);
router.post('/createUserTodo', users_controller_1.default.createTodoUser);
router.post('/login', validator_1.loginValidation(), validator_1.validate, users_controller_1.default.login);
exports.default = router;
