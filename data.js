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
            "quantity": 2,
            "description": "Product 1",
            "tax-rate": 6,
            "price": 33.87
        },
        {
            "quantity": 4.1,
            "description": "Product 2",
            "tax-rate": 6,
            "price": 12.34
        },
        {
            "quantity": 4.5678,
            "description": "Product 3",
            "tax-rate": 21,
            "price": 6324.453456
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
};