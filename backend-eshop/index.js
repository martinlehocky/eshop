const express = require('express')
const cors = require('cors')
const app = express()
const port = 3333

app.use(cors())
app.use(express.json())

const products = [
    {
        name: 'Product 1',
        price: 100,
        category: 'Category 1'
    },
    {
        name: 'Product 2',
        price: 200,
        category: 'Category 2'
    }
]

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/produkty', (req, res) => {
    res.json(products);
})

app.post('/produkty', (req, res) => {
    const { category, name, price } = req.body

    if (!category) res.send('Pole kategoria je povinne!')
    if (!name) res.send('Pole nazov je povinne!')
    if (!price) res.send('Pole cena je povinne!')

    products.push({ category, name, price, id: crypto.randomUUID() })
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