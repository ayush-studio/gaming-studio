// api/orders.js — Vercel Serverless Function for Gaming Studio Orders API
const ordersStore = new Map();

function generateGameKey(title) {
  const prefix = (title || 'GAME')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 4)
    .padEnd(4, 'X');

  const segment = () => Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4).padEnd(4, '0');
  return `${prefix}-${segment()}-${segment()}-${segment()}`;
}

function generateOrderNumber() {
  return `GS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { orderNumber } = req.query;

  // GET order by orderNumber
  if (req.method === 'GET') {
    if (!orderNumber) return res.status(400).json({ success: false, message: 'orderNumber parameter required' });
    const order = ordersStore.get(orderNumber);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    return res.status(200).json({ success: true, data: order });
  }

  // POST checkout
  if (req.method === 'POST') {
    const { customerName, customerEmail, items } = req.body || {};

    if (!customerName || !customerEmail || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing required checkout fields' });
    }

    const orderNum = generateOrderNumber();

    const itemsWithKeys = items.map(item => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      licenseKey: generateGameKey(item.title),
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxAmount = totalAmount * 0.1;
    const grandTotal = totalAmount + taxAmount;

    const orderData = {
      orderNumber: orderNum,
      customerName,
      customerEmail,
      items: itemsWithKeys,
      subtotal: totalAmount,
      tax: taxAmount,
      total: grandTotal,
      status: 'completed',
      createdAt: new Date().toISOString(),
    };

    ordersStore.set(orderNum, orderData);

    return res.status(200).json({ success: true, data: orderData });
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
