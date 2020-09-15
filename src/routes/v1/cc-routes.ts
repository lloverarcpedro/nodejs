import express from 'express'
import { isAuth } from '../../middlewares/auth'
import ccController from '../../controllers/v1/cc-controller'
import caController from '../../controllers/v1/ca-controller'

const router = express.Router()

router.post('/invokeCC', isAuth, ccController.invokeCC)
router.get('/queryCC',isAuth,ccController.queryCC)
router.get('/catest', caController.enrollAdmin)
router.post('/enrollUser',caController.enrollUser)
router.post('/reenroll', caController.reenroll)

export default router