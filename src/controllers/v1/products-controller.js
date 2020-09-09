const Products = require('../../mongo/models/products-model')

const createProduct = async (req, res) => {
  try {
    const { title, desc, price, images, userId } = req.body
    const product = await Products.create({
      title,
      desc,
      price,
      images,
      user: userId,
    })

    res.send({
      status: 'OK',
      data: product,
    })
  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: `${error.message}`,
    })
  }
}

const getProducts = async (req, res) => {
  try {
    const productsList = await Products.find().populate('user','username email data.age').select('title desc price')
    res.send({
        status: 'OK',
        data: productsList,
      })
  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: `${error.message}`,
    })
  }
}

const deleteProduct = (req, res) => {
  res.send({
    status: 'OK',
    message: 'Product Deleted',
  })
}

const getProductByUser = async (req, res) => {
  try {
    const userId = req.params.userId
    const productsList = await Products.find({
      user:userId
    })
    res.send({
        status: 'OK',
        data: productsList,
      })
  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: `${error.message}`,
    })
  }
}

module.exports = { createProduct, deleteProduct, getProductByUser, getProducts }
