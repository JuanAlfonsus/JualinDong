const { Op } = require('sequelize')
const easyinvoice = require('easyinvoice');
const formatCurrency = require('../helpers/formatCurrency')
const { User, UserDetail, Product, Category } = require('../models')
const fs = require('fs');


class ProductController {
    static findAllProduct(req, res) {
        const { search } = req.query
        const { role, userId } = req.session
        const options = {where: {
            stock: {
                [Op.gt] : 0
            }
        }}
        if (search) options.where.name = {
            [Op.iLike] : `%${search}%`
        }
        Product.findAll(options)
            .then((products) => {
                res.render('listProducts', { products, formatCurrency, search, role, userId })
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
    }

    static detailProduct(req, res) {
        const { productId } = req.params
        const { error } = req.query
        const buyItem = req.session.buyItem

        let product

        Product.findByPk(productId, {
            include: [User, Category]
        })
            .then((result) => {
                product = result
                return User.findByPk(product.User.id, {
                    include: [UserDetail]
                })
            })
            .then((result) => {
                req.session.productId = productId
                console.log(product.Categories[0])
                res.render('productDetail', { product, result, error, formatCurrency, buyItem })
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
    }

    static buyProduct(req, res) {
        const { productId } = req.params
        let product

        Product.findByPk(productId)
            .then((result) => {
                product = result
                return result.decrement('stock')
            })
            .then(() => {
                const data = {
                    // Customize enables you to provide your own templates
                    // Please review the documentation for instructions and examples
                    "customize": {
                        //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html 
                    },
                    "images": {
                        // The logo on top of your invoice
                        "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png",
                        // The invoice background
                        "background": "https://public.easyinvoice.cloud/img/watermark-draft.jpg"
                    },
                    // Your own data
                    "sender": {
                        "company": "Jualin Dong",
                        "address": "Jl. Pegangsaan Timur No.15 RT 11 RW 10",
                        "zip": "17450",
                        "city": "Jakarta Timur",
                        "country": "Jakarta"
                    },
                    // Your recipient
                    "client": {
                        "company": "Nama User",
                        "address": "Clientstreet 456"
                    },
                    "information": {
                        // Invoice number
                        "number": "2021.0001",
                        // Invoice data
                        "date": "12-12-2021",
                        // Invoice due date
                        "due-date": "31-12-2021"
                    },
                    // The products you would like to see on your invoice
                    // Total values are being calculated automatically
                    "products": [
                        {
                            "quantity": 1,
                            "description": product.name,
                            "tax-rate": 0,
                            "price": product.price
                        }
                    ],
                    // The message you would like to display on the bottom of your invoice
                    "bottom-notice": "Terimakasih telah berbelanja",
                    // Settings to customize your invoice
                    "settings": {
                        "currency": "IDR", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
                        "locale": "id-ID", // Defaults to en-US, used for number formatting (See documentation 'Locales and Currency')
                    },
                    // Translate your invoice to your preferred language
                    "translate": {
                        // "invoice": "FACTUUR",  // Default to 'INVOICE'
                        // "number": "Nummer", // Defaults to 'Number'
                        // "date": "Datum", // Default to 'Date'
                        // "due-date": "Verloopdatum", // Defaults to 'Due Date'
                        // "subtotal": "Subtotaal", // Defaults to 'Subtotal'
                        // "products": "Producten", // Defaults to 'Products'
                        // "quantity": "Aantal", // Default to 'Quantity'
                        // "price": "Prijs", // Defaults to 'Price'
                        // "product-total": "Totaal", // Defaults to 'Total'
                        // "total": "Totaal", // Defaults to 'Total'
                        // "vat": "btw" // Defaults to 'vat'
                    },
                }
                easyinvoice.createInvoice(data, function (result) {
                    //The response will contain a base64 encoded PDF file
                    fs.writeFileSync("invoice.pdf", result.pdf, 'base64')
                })

                req.session.invoice = true
                res.redirect(`/products/${productId}`)
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
    }

}

module.exports = ProductController