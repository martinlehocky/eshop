const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
const app = express()
const port = 3333

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

const products = [
    {
        id: '1',
        name: 'Product 1',
        price: 100,
        category: 'Category 1',
        description: 'Description for Product 1',
        image: 'https://placehold.co/300'
    },
    {
        id: '2',
        name: 'Product 2',
        price: 200,
        category: 'Category 2',
        description: 'Description for Product 2',
        image: 'https://placehold.co/300'
    }
]

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/produkty', (req, res) => {
    res.json(products);
})

app.post('/produkty', upload.single('image'), (req, res) => {
    const { category, name, price, description } = req.body

    // Basic validation
    if (!name) return res.status(400).send('Pole nazov je povinne!')
    if (!price) return res.status(400).send('Pole cena je povinne!')

    // Construct image URL
    let imageUrl = 'https://placehold.co/300'; // Default image
    if (req.file) {
        imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`
    }

    const newProduct = {
        id: crypto.randomUUID(),
        name,
        price: Number(price), // Ensure price is a number
        category: category || 'Uncategorized',
        description: description || '',
        image: imageUrl
    }

    products.push(newProduct)
    res.status(201).json(newProduct)
})

app.put('/', (req, res) => {
    res.send('Hello World!')
})

app.delete('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})