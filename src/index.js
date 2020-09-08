const express = require('express')
const routesV1 = require('./routes/v1/index')

const app = express()

routesV1(app)

app.listen(4000, () => {
  console.log('Running on port 4000')
})