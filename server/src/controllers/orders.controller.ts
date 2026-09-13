import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/database';

interface CartItem {
  id: number;
  slug: string;
  title: string;
  price: number;
  quantity: number;
}

interface CheckoutBody {
  customerName: string;
  customerEmail: string;
  items: CartItem[];
}

function generateGameKey(title: string): string {
  const prefix = title
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 4)
    .padEnd(4, 'X');

  const segment = () =>
    Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4).padEnd(4, '0');

  return `${prefix}-${segment()}-${segment()}-${segment()}`;
}

function generateOrderNumber(): string {
  return `GS-${Date.now().toString(36).toUpperCase()}-${uuidv4().split('-')[0].toUpperCase()}`;
}

export const checkout = (req: Request, res: Response): void => {
  try {
    const { customerName, customerEmail, items }: CheckoutBody = req.body;

    if (!customerName || !customerEmail || !items || items.length === 0) {
      res.status(400).json({ success: false, message: 'Missing required checkout fields' });
      return;
    }

    const orderNumber = generateOrderNumber();

    // Build items with generated license keys
    const itemsWithKeys = items.map((item) => ({
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

    const stmt = db.prepare(`
      INSERT INTO orders (order_number, customer_name, customer_email, total_amount, status, items_json)
      VALUES (?, ?, ?, ?, 'completed', ?)
    `);

    stmt.run(orderNumber, customerName, customerEmail, grandTotal, JSON.stringify(itemsWithKeys));

    res.json({
      success: true,
      data: {
        orderNumber,
        customerName,
        customerEmail,
        items: itemsWithKeys,
        subtotal: totalAmount,
        tax: taxAmount,
        total: grandTotal,
        status: 'completed',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('checkout error:', error);
    res.status(500).json({ success: false, message: 'Checkout failed' });
  }
};

export const getOrder = (req: Request, res: Response): void => {
  try {
    const { orderNumber } = req.params;
    const stmt = db.prepare('SELECT * FROM orders WHERE order_number = ?');
    const order = stmt.get(orderNumber) as any;

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    const items = JSON.parse(order.items_json);
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    res.json({
      success: true,
      data: {
        ...order,
        items,
        subtotal,
        tax: subtotal * 0.1,
      },
    });
  } catch (error) {
    console.error('getOrder error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
};
