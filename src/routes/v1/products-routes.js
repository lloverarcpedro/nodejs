const express = require('express')
const producsController = require('../../controllers/v1/products-controller')

const router = express.Router()

router.post('/create', producsController.createProduct)
router.post('/delete', producsController.deleteProduct)
router.get('/getByUser', producsController.getProductByUser)

module.exports = router