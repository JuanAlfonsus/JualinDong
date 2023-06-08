const express = require('express')
const ProductController = require('../controllers/product')
const router = express.Router()

router.get('/', ProductController.findAllProduct)
router.get('/:productId', ProductController.detailProduct)

router.use(function (req, res, next) {
    if (req.session.role === 'buyer') {
        req.session.buyItem = true
        next()
    } else {
        const error = 'Hanya buyer yang dapat membeli products'
        res.redirect(`/products/${req.session.productId}?error=${error}`)
    }
})

router.get('/:productId/buy', ProductController.buyProduct)

module.exports = router