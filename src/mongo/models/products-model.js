const mongoose = require('mongoose')
const { Schema } = mongoose

const productSchema = new Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: String, required: true },
    images : {type : [{type: String, required: true}] , default:["https://static.thenounproject.com/png/1375595-200.png"]} ,
    user : {type: mongoose.Schema.Types.ObjectId, ref : 'User', require: true}
  },
  {
    timestamps: true,
  }
)

const model = mongoose.model('Product', productSchema)
module.exports = model
