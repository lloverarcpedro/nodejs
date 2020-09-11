import express from 'express'
import { isAuth } from '../../middlewares/auth'
import ccController from '../../controllers/v1/cc-controller'

const router = express.Router()

router.post('/invokeCC', isAuth, ccController.invokeCC)
router.get('/queryCC',isAuth,ccController.queryCC)

export default router