const express = require('express')
const UserController = require('../controllers/user')
const router = express.Router()

router.use(function (req, res, next) {
    if (req.session.role) {
        next()
    } else {
        const error = 'Harap login terlebih dahulu'
        res.redirect(`/login?error=${error}`)
    }
})

router
    .get('/detail/:userId', UserController.userDetail)
    .get('/addDetail/:userId', UserController.addDetail)
    .post('/addDetail/:userId', UserController.postAddDetail)
    .get('/edit/:userId', UserController.editDetail)
    .post('/edit/:userId', UserController.postEditDetail)
    .get('/logout', UserController.logout)


router.use(function (req, res, next) {
    if (req.session.role === 'seller') {
        next()
    } else {
        const error = 'Hanya seller yang dapat add products'
        res.redirect(`/user/detail/${req.session.userId}?error=${error}`)
    }
})

router
    .get('/addProduct/:userId', UserController.addProduct)
    .post('/addProduct/:userId', UserController.postAddProduct)
    .get('/editProduct/:userId/:productId', UserController.editProduct)
    .post('/editProduct/:userId/:productId', UserController.postEditProduct)

    .get('/deleteProduct/:userId/:productId', UserController.deleteProduct)

module.exports = router