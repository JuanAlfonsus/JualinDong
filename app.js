const express = require('express')
const app = express()
const port = 3000
const index = require('./routes/index')
const product = require('./routes/product')
const user = require('./routes/user')
const session = require('express-session')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        sameSite: true
    }
}))

app.use(index)
app.use('/user', user)
app.use('/products', product)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})