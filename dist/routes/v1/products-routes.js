"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const products_controller_1 = __importDefault(require("../../controllers/v1/products-controller"));
const router = express_1.default.Router();
router.post('/create', products_controller_1.default.createProduct);
router.post('/delete', products_controller_1.default.deleteProduct);
router.get('/getAll', products_controller_1.default.getProducts);
router.get('/getByUser/:userId', products_controller_1.default.getProductByUser);
exports.default = router;
