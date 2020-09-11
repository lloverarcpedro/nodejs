import express from 'express'
import producsController from '../../controllers/v1/products-controller'

const router = express.Router()

router.post('/create', producsController.createProduct)
router.post('/delete', producsController.deleteProduct)
router.get('/getAll', producsController.getProducts)
router.get('/getByUser/:userId', producsController.getProductByUser)


export default router
