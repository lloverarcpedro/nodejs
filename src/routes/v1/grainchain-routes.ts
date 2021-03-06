import express from 'express'
import grainchainController from '../../controllers/v1/grainchain-controller'
import {validate, addContractValidator }  from '../../middlewares/validator'

const router = express.Router()

router.post('/createContract',addContractValidator(), validate, grainchainController.createContract)
router.get('/getContract/:id', grainchainController.getContract)


export default router
