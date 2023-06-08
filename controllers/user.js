const { ValidationError } = require('sequelize')
const formatCurrency = require('../helpers/formatCurrency')
const { User, UserDetail, Product, Category } = require('../models')
const bcrypt = require('bcryptjs');

class UserController {
    static register(req, res) {
        const { error } = req.query
        res.render('register', { error })
    }

    static postRegister(req, res) {
        const { email, password, role } = req.body
        User.create({ email, password, role })
            .then(() => {
                res.redirect('/login')
            })
            .catch((err) => {
                if (err instanceof ValidationError) {
                    const errors = err.errors.map(e => e.message)
                    res.redirect(`/register?error=${errors}`)
                } else {
                    console.log(err)
                    res.send(err)
                }
            })
    }

    static login(req, res) {
        const { error } = req.query
        res.render('login', { error })
    }

    static postLogin(req, res) {
        const { email, password } = req.body
        User.findOne({
            where: { email }
        })
            .then((user) => {
                if (user) {
                    const isValidPassword = bcrypt.compareSync(password, user.password)
                    if (isValidPassword) {
                        const userId = user.id
                        req.session.role = user.role
                        req.session.userId = userId
                        return res.redirect(`/user/detail/${user.id}`)
                    } else {
                        const errors = 'Email atau password salah!'
                        return res.redirect(`/login?error=${errors}`)
                    }
                } else {
                    const errors = 'Email atau password salah!'
                    return res.redirect(`/login?error=${errors}`)
                }
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
    }

    static userDetail(req, res) {
        const { userId } = req.session
        const { error } = req.query
        User.findByPk(userId, {
            attributes: ['id', 'email', 'role'],
            include: [UserDetail, Product]
        })
            .then((user) => {
                res.render('userDetail', { user, error, formatCurrency })
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
    }

    static addDetail(req, res) {
        const { userId } = req.session
        const { error } = req.query
        console.log(error)
        User.findByPk(userId, {
            attributes: ['id']
        })
            .then((user) => {
                res.render('addDetail', { user, error })
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
    }

    static postAddDetail(req, res) {
        const UserId = req.session.userId
        const { name, phone, address, image } = req.body
        console.log({ name, phone, address, image })
        UserDetail.create({ name, phone, address, image, UserId })
            .then(() => {
                res.redirect(`/user/detail/${UserId}`)
            })
            .catch((err) => {
                if (err instanceof ValidationError) {
                    const errors = err.errors.map(e => e.message)
                    res.redirect(`/user/addDetail/${UserId}?error=${errors}`)
                } else {
                    console.log(err)
                    res.send(err)
                }
            })
    }

    static editDetail(req, res) {
        const UserId = req.session.userId
        User.findByPk(UserId, {
            include: UserDetail
        })
            .then((user) => {
                res.render('editDetail', { user })
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
    }

    static postEditDetail(req, res) {
        const UserId = req.session.userId
        const { name, phone, address, image } = req.body

        User.findByPk(UserId, {
            include: UserDetail
        })
            .then((user) => {
                return user.UserDetail.update({ name, phone, address, image })
            })
            .then(() => {
                res.redirect(`/user/detail/${UserId}`)
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })

    }

    static addProduct(req, res) {
        const { error } = req.query
        const { userId } = req.session
        let categories
        Category.findAll()
            .then((result) => {
                categories = result
                return User.findByPk(userId, {
                    attributes: ['id']
                })
            })
            .then((user) => {
                res.render('addProduct', { error, categories, user })
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
    }

    static postAddProduct(req, res) {
        const UserId = req.session.userId // harus dari session
        const { name, description, price, productImage, stock } = req.body
        
        Product.create({ name, description, price, productImage, stock, UserId })
            .then((product) => {
                console.log(req.body.CategoryId)
                return product.addCategories(req.body.CategoryId)
            })
            .then((result) => {
                console.log(result)
                res.redirect(`/user/detail/${UserId}`)
            })
            .catch((err) => {
                if (err instanceof ValidationError) {
                    console.log(UserId)
                    const errors = err.errors.map(e => e.message)
                    res.redirect(`/user/addProduct/${UserId}?error=${errors}`)
                } else {
                    console.log(err)
                    res.send(err)
                }
            })
    }

    static deleteProduct(req, res) {
        const { userId } = req.session
        Product.findByPk(userId)
            .then((product) => {
                return product.destroy({
                    cascade: true
                })
            })
            .then(() => {
                res.redirect(`/user/detail/${userId}`)
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
    }

    static editProduct(req, res) {
        const { productId } = req.params
        const { userId } = req.session
        const { error } = req.query
        let product
        Product.findByPk(productId)
            .then((result) => {
                product = result
                return Category.findAll()
            })
            .then((categories) => {
                res.render('editProduct', { product, error, userId, categories, productId })
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
    }

    static postEditProduct(req, res) {
        const { productId } = req.params
        const { userId } = req.session
        const { name, description, price, productImage, stock } = req.body
        console.log({ name, description, price, productImage, stock })
        Product.findByPk(productId)
            .then((product) => {
                return product.update({ name, description, price, productImage, stock })
            })
            .then(() => {
                res.redirect(`/user/detail/${userId}`)
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
    }

    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }
}

module.exports = UserController