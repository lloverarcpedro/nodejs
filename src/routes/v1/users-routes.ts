import express from 'express'
import { isAuth, isValidHostname, isAdmin } from '../../middlewares/auth'
import usersController from '../../controllers/v1/users-controller'

const router = express.Router()

router.post('/create', usersController.createUSer)
router.put('/update',isValidHostname, isAuth, usersController.updateUser)
router.post('/delete', isAuth, isAdmin, usersController.deleteUSer)
router.get('/getUsers',isAuth, usersController.getAllUsers)
router.post('/login', usersController.login)

export default router