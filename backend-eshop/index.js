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

const fs = require('fs')

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/produkty', (req, res) => {
    const productsFile = path.join(__dirname, 'products.json');
    if (fs.existsSync(productsFile)) {
        const productsData = fs.readFileSync(productsFile, 'utf8');
        res.json(JSON.parse(productsData));
    } else {
        res.json([]);
    }
})

app.post('/produkty', upload.single('image'), (req, res) => {
    const { category, name, price, description } = req.body

    if (!name) return res.status(400).send('Pole nazov je povinne!')
    if (!price) return res.status(400).send('Pole cena je povinne!')

    let imageUrl = 'https://placehold.co/300';
    if (req.file) {
        imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`
    }

    const newProduct = {
        id: crypto.randomUUID(),
        name,
        price: Number(price),
        category: category || 'Uncategorized',
        description: description || '',
        image: imageUrl
    }

    const productsFile = path.join(__dirname, 'products.json');
    let products = [];
    if (fs.existsSync(productsFile)) {
        products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
    }

    products.push(newProduct)
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2), 'utf8');

    res.status(201).json(newProduct)
})

app.get('/produkty/:id', (req, res) => {
    const { id } = req.params;
    const productsFile = path.join(__dirname, 'products.json');

    if (fs.existsSync(productsFile)) {
        const productsData = fs.readFileSync(productsFile, 'utf8');
        const products = JSON.parse(productsData);

        const product = products.find(p => p.id === id);
        res.json(product);
    }

})
app.put('/produkty/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, category, description, image } = req.body;
    const productsFile = path.join(__dirname, 'products.json');


    let products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
    const index = products.findIndex(p => p.id === id);

    products[index] = {
        ...products[index],
        name: name ?? products[index].name,
        price: price !== undefined ? Number(price) : products[index].price,
        category: category ?? products[index].category,
        description: description ?? products[index].description,
        image: image ?? products[index].image
    };

    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2), 'utf8');
    res.json(products[index]);
});

app.delete('/produkty/:id', (req, res) => {
    const { id } = req.params;
    const productsFile = path.join(__dirname, 'products.json');


    let products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
    const index = products.findIndex(p => p.id === id);


    const deleted = products.splice(index, 1)[0];
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2), 'utf8');
    res.json(deleted);
});



app.put('/', (req, res) => {
    res.send('Hello World!')
})

app.delete('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})