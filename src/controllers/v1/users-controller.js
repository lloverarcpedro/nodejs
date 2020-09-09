const bcrypt = require('bcrypt')
const Users = require('../../mongo/models/users-model')

const createUSer = async (req, res) => {
  try {
    const { username, email, password, data, role } = req.body

    const hash = await bcrypt.hash(password, 15)

    await Users.create({
      username,
      email,
      data,
      password: hash,
      role,
    })
    res.send({
      status: 'OK',
      message: 'User Created',
    })
  } catch (error) {
    console.log(error.code)
    if (error.code && error.code == 11000) {
      res.status(400).send({
        status: 'Duplicate Values',
        message: error.keyValue,
      })
      return
    }
    res.status(500).send({
      status: 'Error',
      message: 'An Error Ocurred, try againg later',
    })
  }
}


const deleteUSer = (req, res) => {
  res.send({
    status: 'OK',
    message: 'User Deleted',
  })
}
const getUsers = (req, res) => {
  res.send({
    status: 'OK',
    message: 'User Value',
  })
}
const updateUser = (req, res) => {
  res.send({
    status: 'OK',
    message: 'User Updated',
  })
}

module.exports = { createUSer, deleteUSer, updateUser, getUsers }
