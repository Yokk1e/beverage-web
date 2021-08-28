export interface CreateOrderForm {
  orderItems: CreateOrderItemDto[];
}

export interface CreateOrderItemDto {
  beverageId: number;
  amount: number;
  orderSubItems?: CreateOrderSubItemDto[];
}

export interface CreateOrderSubItemDto {
  beverageOptionId: number;
}
