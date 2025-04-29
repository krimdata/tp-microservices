const express = require('express');
require('dotenv').config();
const { authMiddleware } = require('./middleware');

const app = express();
app.use(express.json());
app.use(authMiddleware);

const PORT = process.env.PORT || 3000;
let orders = [];
let products = [
  { id: 1, name: 'T-shirt', price: 19.99 },
  { id: 2, name: 'Mug', price: 9.99 }
];

app.get('/orders/health', (req, res) => res.json({ status: 'Order Service OK' }));

app.get('/orders', (req, res) => res.json(orders));

app.post('/orders', (req, res) => {
  const { userId, products: orderProducts } = req.body;
  const orderProductDetails = orderProducts.map(op => {
    const product = products.find(p => p.id === op.id);
    if (!product) return null;
    return { ...product, qty: op.qty };
  }).filter(op => op !== null);

  if (orderProductDetails.length === 0) {
    return res.status(400).json({ error: 'Invalid products in order' });
  }

  const newOrder = { 
    id: orders.length + 1,
    userId,
    products: orderProductDetails,
    status: 'created',
    createdAt: new Date()
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
});

app.listen(PORT, () => console.log('Order Service running'));

