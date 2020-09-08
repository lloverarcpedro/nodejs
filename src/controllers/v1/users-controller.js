const createUSer = (req, res) => {
  res.send({
      status: "OK",
      message : "User Created"
  })
}
const deleteUSer = (req, res) => {
    res.send({
        status: "OK",
        message : "User Deleted"
    })
}
const getUsers = (req, res) => {
    res.send({
        status: "OK",
        message : "User Value"
    })
}
const updateUser = (req, res) => {
    res.send({
        status: "OK",
        message : "User Updated"
    })
}

module.exports = { createUSer, deleteUSer, updateUser, getUsers }
