export interface Order {
  id: string;
  totalPrice: number;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: string;
  totalPrice: number;
  amount: number;
  orderSubItems?: OrderSubItem[];
}

export interface OrderSubItem {
  beverageOptionId: number;
}
