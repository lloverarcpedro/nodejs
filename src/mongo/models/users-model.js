const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    data: {
      age: Number,
      isMale: Boolean,
    },
    role: { type: String, enum: ['admin', 'seller'], default: 'seller' },
  },
  {
    timestamps: true,
  }
)

const model = mongoose.model('User', userSchema)
module.exports = model