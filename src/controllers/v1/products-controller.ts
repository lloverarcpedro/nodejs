/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Products from '../../mongo/models/products-model'
import { Request, Response } from 'express'

const createProduct = async (req: Request, res: Response) => {
    try {
        const { title, desc, price, images, userId } = req.body
        const product = await Products.create({
            title,
            desc,
            price,
            images,
            user: userId,
        })

        res.send({
            status: 'OK',
            data: product,
        })
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: `${error.message}`,
        })
    }
}

const getProducts = async (req: Request, res: Response) => {
    try {
        const productsList = await Products.find().populate('user', 'username email data.age').select('title desc price')
        res.send({
            status: 'OK',
            data: productsList,
        })
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: `${error.message}`,
        })
    }
}

const deleteProduct = (req: Request, res: Response) => {
    res.send({
        status: 'OK',
        message: 'Product Deleted',
    })
}

const getProductByUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId
        const productsList = await Products.find({
            user: userId
        })
        res.send({
            status: 'OK',
            data: productsList,
        })
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: `${error.message}`,
        })
    }
}

export default { createProduct, deleteProduct, getProductByUser, getProducts }
