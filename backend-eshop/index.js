import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { prisma } from './orm.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = 3333

app.use(cors())
app.use(express.json())

const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

app.use('/uploads', express.static(uploadDir))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/produkty', async (req, res) => {
    try {
        const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
        res.json(products)
    } catch (error) {
        console.error('Failed to fetch products', error)
        res.status(500).json({ error: 'Failed to fetch products' })
    }
})

app.post('/produkty', upload.single('image'), async (req, res) => {
    const { category, name, price, description } = req.body

    if (!name) return res.status(400).send('Pole nazov je povinne!')
    if (price === undefined) return res.status(400).send('Pole cena je povinne!')

    const parsedPrice = parseFloat(price)
    if (Number.isNaN(parsedPrice)) return res.status(400).send('Pole cena musi byt cislo!')

    let imageUrl = 'https://placehold.co/300'
    if (req.file) {
        imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`
    }

    try {
        const newProduct = await prisma.product.create({
            data: {
                name,
                price: parsedPrice,
                category: category || 'Uncategorized',
                description: description || '',
                image: imageUrl
            }
        })

        res.status(201).json(newProduct)
    } catch (error) {
        console.error('Failed to create product', error)
        res.status(500).json({ error: 'Failed to create product' })
    }
})

app.get('/produkty/:id', async (req, res) => {
    const { id } = req.params
    try {
        const product = await prisma.product.findUnique({ where: { id } })
        if (!product) return res.status(404).json({ error: 'Product not found' })
        res.json(product)
    } catch (error) {
        console.error('Failed to fetch product', error)
        res.status(500).json({ error: 'Failed to fetch product' })
    }
})

app.put('/produkty/:id', async (req, res) => {
    const { id } = req.params
    const { name, price, category, description, image } = req.body

    const data = {}
    if (name !== undefined) data.name = name
    if (category !== undefined) data.category = category
    if (description !== undefined) data.description = description
    if (image !== undefined) data.image = image
    if (price !== undefined) {
        const parsedPrice = parseFloat(price)
        if (Number.isNaN(parsedPrice)) return res.status(400).send('Pole cena musi byt cislo!')
        data.price = parsedPrice
    }

    try {
        const existing = await prisma.product.findUnique({ where: { id } })
        if (!existing) return res.status(404).json({ error: 'Product not found' })

        const updated = await prisma.product.update({ where: { id }, data })
        res.json(updated)
    } catch (error) {
        console.error('Failed to update product', error)
        res.status(500).json({ error: 'Failed to update product' })
    }
})

app.delete('/produkty/:id', async (req, res) => {
    const { id } = req.params
    try {
        const existing = await prisma.product.findUnique({ where: { id } })
        if (!existing) return res.status(404).json({ error: 'Product not found' })

        const deleted = await prisma.product.delete({ where: { id } })
        res.json(deleted)
    } catch (error) {
        console.error('Failed to delete product', error)
        res.status(500).json({ error: 'Failed to delete product' })
    }
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