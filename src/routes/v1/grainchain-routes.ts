import express from 'express'
import grainchainController from '../../controllers/v1/grainchain-controller'

const router = express.Router()

router.post('/createContract', grainchainController.createContract)
router.get('/getContract/:id', grainchainController.getContract)


export default router
