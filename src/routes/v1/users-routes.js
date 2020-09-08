const express = require('express')
const usersController = require('../../controllers/v1/users-controller')

const router = express.Router()

router.post('/create', usersController.createUSer)
router.post('/update', usersController.updateUser)
router.post('/delete', usersController.deleteUSer)
router.get('/getUsers', usersController.getUsers)

module.exports = router