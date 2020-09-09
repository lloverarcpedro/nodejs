const express = require('express')
const routesV1 = require('./routes/v1/index')
const bodyParser = require('body-parser')
const dotEnv = require('dotenv')
const mongoose = require('mongoose')

dotEnv.config() //Enable environment variables read.

const app = express()
app.use(bodyParser.urlencoded({ extended: false })) //Enable urlencode body
app.use(bodyParser.json()) //Enable json body

routesV1(app)

const PORT = process.env.PORT || 4000 

 mongoose
 .connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(()=>{
    console.log('Connected to MongoDB')
  })
  .catch(error =>{
    console.log('Connection Error', error)
  })


app.listen( PORT, () => {
  console.log(`Running on port ${PORT}`)
})