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
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const products_model_1 = __importDefault(require("../../mongo/models/products-model"));
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, desc, price, images, userId } = req.body;
        const product = yield products_model_1.default.create({
            title,
            desc,
            price,
            images,
            user: userId,
        });
        res.send({
            status: 'OK',
            data: product,
        });
    }
    catch (error) {
        res.status(500).send({
            status: 'error',
            message: `${error.message}`,
        });
    }
});
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productsList = yield products_model_1.default.find().populate('user', 'username email data.age').select('title desc price');
        res.send({
            status: 'OK',
            data: productsList,
        });
    }
    catch (error) {
        res.status(500).send({
            status: 'error',
            message: `${error.message}`,
        });
    }
});
const deleteProduct = (req, res) => {
    res.send({
        status: 'OK',
        message: 'Product Deleted',
    });
};
const getProductByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const productsList = yield products_model_1.default.find({
            user: userId
        });
        res.send({
            status: 'OK',
            data: productsList,
        });
    }
    catch (error) {
        res.status(500).send({
            status: 'error',
            message: `${error.message}`,
        });
    }
});
exports.default = { createProduct, deleteProduct, getProductByUser, getProducts };
