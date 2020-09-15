import express from 'express'
import { isAuth, isValidHostname, isAdmin } from '../../middlewares/auth'
import usersController from '../../controllers/v1/users-controller'
import {validate, loginValidation, createValidation }  from '../../middlewares/validator'

const router = express.Router()

router.post('/create', createValidation(), validate, usersController.createUSer)
router.put('/update',isValidHostname, isAuth, usersController.updateUser)
router.post('/delete', isAuth, isAdmin, usersController.deleteUSer)
router.get('/getUsers',isAuth, usersController.getAllUsers)
router.post('/getUsersTodo', usersController.getTodosUsers)
router.post('/createUserTodo', usersController.createTodoUser)
router.post('/login', loginValidation(), validate, usersController.login)

export default router