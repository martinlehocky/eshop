import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { prisma } from './orm.js'

const app = express()
const port = 3333

app.use(cors())
app.use(express.json())

const upload = multer({ storage: multer.memoryStorage() })
const PLACEHOLDER_IMAGE = 'https://placehold.co/300'

const toDto = (product) => {
    const price = product?.price?.toNumber ? product.price.toNumber() : Number(product.price ?? 0)

    let image = PLACEHOLDER_IMAGE
    if (product.image) {
        // Check if it's a Buffer
        if (Buffer.isBuffer(product.image)) {
            image = `data:image/jpeg;base64,${product.image.toString('base64')}`
        }
        // Check if it's a Uint8Array (common with Prisma PG adapter)
        else if (product.image instanceof Uint8Array) {
            const buffer = Buffer.from(product.image)
            image = `data:image/jpeg;base64,${buffer.toString('base64')}`
        }
        // Check if it's an object with type 'Buffer' and data array
        else if (product.image.type === 'Buffer' && Array.isArray(product.image.data)) {
            const buffer = Buffer.from(product.image.data)
            image = `data:image/jpeg;base64,${buffer.toString('base64')}`
        }
        else if (typeof product.image === 'string') {
            image = product.image
        } else {
            console.log('Unknown image type:', typeof product.image, product.image.constructor?.name)
        }
    }

    return { ...product, id: String(product.id), price, image }
}

app.get('/produkty', async (req, res) => {
    try {
        const products = await prisma.product.findMany({ orderBy: { name: 'asc' } })
        res.json(products.map(toDto))
    } catch (error) {
        console.error('Failed to fetch products', error)
        res.status(500).json({ error: 'Failed to fetch products from database' })
    }
})

app.post('/produkty', upload.single('image'), async (req, res) => {
    const { category, name, price, description } = req.body

    if (!name) return res.status(400).send('Pole nazov je povinne!')
    if (price === undefined) return res.status(400).send('Pole cena je povinne!')

    const parsedPrice = parseFloat(price)
    if (Number.isNaN(parsedPrice)) return res.status(400).send('Pole cena musi byt cislo!')

    const imageBuffer = req.file ? req.file.buffer : null

    try {
        const newProduct = await prisma.product.create({
            data: {
                name,
                price: parsedPrice,
                category: category || 'Uncategorized',
                description: description || '',
                image: imageBuffer
            }
        })

        res.status(201).json(toDto(newProduct))
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
        res.json(toDto(product))
    } catch (error) {
        console.error('Failed to fetch product', error)
        res.status(500).json({ error: 'Failed to fetch product' })
    }
})

app.put('/produkty/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params
    const { name, price, category, description, image } = req.body

    const data = {}
    if (name !== undefined) data.name = name
    if (category !== undefined) data.category = category
    if (description !== undefined) data.description = description

    if (req.file) {
        data.image = req.file.buffer
    } else if (image !== undefined) {
        data.image = image ? Buffer.from(image.replace(/^data:image\/[a-zA-Z]+;base64,/, ''), 'base64') : null
    }

    if (price !== undefined) {
        const parsedPrice = parseFloat(price)
        if (Number.isNaN(parsedPrice)) return res.status(400).send('Pole cena musi byt cislo!')
        data.price = parsedPrice
    }

    try {
        const existing = await prisma.product.findUnique({ where: { id } })
        if (!existing) return res.status(404).json({ error: 'Product not found' })

        const updated = await prisma.product.update({ where: { id }, data })
        res.json(toDto(updated))
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
        res.json(toDto(deleted))
    } catch (error) {
        console.error('Failed to delete product', error)
        res.status(500).json({ error: 'Failed to delete product' })
    }
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})