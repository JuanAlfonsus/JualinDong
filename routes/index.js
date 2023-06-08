const express = require('express')
const UserController = require('../controllers/user')
const router = express.Router()

router.get('/', (req, res) => {
    let role
    res.render('index', { role })
})

router
    .get('/register', UserController.register)
    .post('/register', UserController.postRegister)
    .get('/login', UserController.login)
    .post('/login', UserController.postLogin)

module.exports = router