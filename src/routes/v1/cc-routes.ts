import express from 'express'
import { isAuth } from '../../middlewares/auth'
import ccController from '../../controllers/v1/cc-controller'

const router = express.Router()

router.get('/invokeCC/:destination', isAuth, ccController.invokeCC)

export default router