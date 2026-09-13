export interface OrderItem {
  id: number;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  licenseKey?: string;
}

export interface Order {
  id?: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt?: string;
  created_at?: string;
}

export interface CheckoutPayload {
  customerName: string;
  customerEmail: string;
  items: {
    id: number;
    slug: string;
    title: string;
    price: number;
    quantity: number;
  }[];
}
