const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors'); // 👈 Ajouté
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Active CORS
app.use(cors()); // 👈 Ajouté

// Proxy with error handling
const handleProxyError = (err, req, res) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};

app.use('/auth', createProxyMiddleware({
  target: process.env.AUTH_URL || 'http://auth-service:3000',
  changeOrigin: true,
  onError: handleProxyError
}));

app.use('/products', createProxyMiddleware({
  target: process.env.PRODUCT_URL || 'http://product-service:3000',
  changeOrigin: true,
  onError: handleProxyError
}));

app.use('/orders', createProxyMiddleware({
  target: process.env.ORDER_URL || 'http://order-service:3000',
  changeOrigin: true,
  onError: handleProxyError
}));

app.get('/health', async (req, res) => {
  try {
    const responses = await Promise.all([
      fetch(`${process.env.AUTH_URL || 'http://auth-service:3000'}/auth/health`),
      fetch(`${process.env.PRODUCT_URL || 'http://product-service:3000'}/products/health`),
      fetch(`${process.env.ORDER_URL || 'http://order-service:3000'}/orders/health`)
    ]);
    const statuses = await Promise.all(responses.map(r => r.json()));
    res.json({ status: 'API Gateway OK', services: statuses });
  } catch (err) {
    res.status(500).json({ error: 'Health check failed', details: err.message });
  }
});

app.listen(PORT, () => console.log('API Gateway running'));

