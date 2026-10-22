const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const sales = [
  { id: 1, item: 'Keyboard', quantity: 2, price: 45, date: '2026-10-22' },
  { id: 2, item: 'Mouse', quantity: 3, price: 20, date: '2026-10-22' },
  { id: 3, item: 'Monitor', quantity: 1, price: 180, date: '2026-10-22' }
];

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: 'v1' });
});

app.get('/api/sales', (req, res) => {
  res.json(sales);
});

app.get('/api/summary', (req, res) => {
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.quantity * sale.price), 0);

  res.json({
    totalSales,
    totalRevenue,
    averageSale: totalSales > 0 ? totalRevenue / totalSales : 0
  });
});

app.post('/api/sales', (req, res) => {
  const { item, quantity, price } = req.body;

  if (!item || !quantity || !price) {
    return res.status(400).json({ error: 'Item, quantity, and price are required.' });
  }

  const parsedQuantity = Number(quantity);
  const parsedPrice = Number(price);

  if (Number.isNaN(parsedQuantity) || Number.isNaN(parsedPrice) || parsedQuantity <= 0 || parsedPrice <= 0) {
    return res.status(400).json({ error: 'Quantity and price must be positive numbers.' });
  }

  const newSale = {
    id: Date.now(),
    item: String(item).trim(),
    quantity: parsedQuantity,
    price: parsedPrice,
    date: new Date().toISOString().slice(0, 10)
  };

  sales.push(newSale);
  res.status(201).json(newSale);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Sales System v1 running on http://localhost:${port}`);
  });
}

module.exports = { app, sales };
