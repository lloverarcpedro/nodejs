const createProduct = (req, res) => {
    res.send({
        status: "OK",
        message : "Product Created"
    })
}

const deleteProduct = (req, res) => {
    res.send({
        status: "OK",
        message : "Product Deleted"
    })
}

const getProductByUser = (req, res) => {
    res.send({
        status: "OK",
        message : "Your Product Goes Here"
    })
}


module.exports = {createProduct, deleteProduct, getProductByUser}
