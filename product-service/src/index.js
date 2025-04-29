const express = require('express');
require('dotenv').config();
const { authMiddleware } = require('./middleware');

const app = express();
app.use(express.json());
app.use(authMiddleware);

const PORT = process.env.PORT || 3000;
let products = [
  { id: 1, name: 'T-shirt', price: 19.99 },
  { id: 2, name: 'Mug', price: 9.99 }
];

app.get('/products/health', (req, res) => res.json({ status: 'Product Service OK' }));

app.get('/products', (req, res) => res.json(products));

app.get('/products/:id', (req, res) => {
  const p = products.find(p => p.id == req.params.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

app.post('/products', (req, res) => {
  const { name, price } = req.body;
  if (!name || !price || isNaN(price)) {
    return res.status(400).json({ error: 'Invalid product data' });
  }
  const newProd = { id: products.length + 1, name, price };
  products.push(newProd);
  res.status(201).json(newProd);
});

app.listen(PORT, () => console.log('Product Service running'));

